export const iframeOverlayScript = `
(function() {
    let inspectMode = false;

    const hoverOverlay = document.createElement('div');
    hoverOverlay.id = '__studio-hover-overlay';
    Object.assign(hoverOverlay.style, {
        position: 'fixed', pointerEvents: 'none', border: '2px solid #89b4fa',
        backgroundColor: 'rgba(137, 180, 250, 0.08)', zIndex: '99998',
        display: 'none', transition: 'all 0.05s ease', borderRadius: '2px'
    });

    const selectOverlay = document.createElement('div');
    selectOverlay.id = '__studio-select-overlay';
    Object.assign(selectOverlay.style, {
        position: 'fixed', pointerEvents: 'none', border: '2px solid #cba6f7',
        backgroundColor: 'rgba(203, 166, 247, 0.08)', zIndex: '99999',
        display: 'none', borderRadius: '2px'
    });

    const label = document.createElement('div');
    label.id = '__studio-label';
    Object.assign(label.style, {
        position: 'fixed', pointerEvents: 'none', zIndex: '100000',
        backgroundColor: '#1e1e2e', color: '#cdd6f4', fontSize: '11px',
        fontFamily: 'monospace', padding: '2px 8px', borderRadius: '3px',
        display: 'none', whiteSpace: 'nowrap', border: '1px solid #45475a',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    });

    function ensureOverlays() {
        if (!hoverOverlay.parentNode) document.body.appendChild(hoverOverlay);
        if (!selectOverlay.parentNode) document.body.appendChild(selectOverlay);
        if (!label.parentNode) document.body.appendChild(label);
    }

    ensureOverlays();

    let selectedElement = null;

    function getLabelText(el) {
        let text = el.tagName.toLowerCase();
        if (el.id) text += '#' + el.id;
        if (el.className && typeof el.className === 'string') {
            const classes = el.className.trim().split(/\\s+/).filter(function(c) { return !c.startsWith('__studio'); });
            if (classes.length) text += '.' + classes.join('.');
        }
        const rect = el.getBoundingClientRect();
        text += '  ' + Math.round(rect.width) + '\\u00d7' + Math.round(rect.height);
        return text;
    }

    function positionOverlay(overlay, rect) {
        overlay.style.left = rect.left + 'px';
        overlay.style.top = rect.top + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
        overlay.style.display = 'block';
    }

    function getSourceLocation(el) {
        try {
            var keys = [];
            try { keys = Object.getOwnPropertyNames(el); } catch(e2) { return null; }
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key.indexOf('__reactFiber') === 0 || key.indexOf('__reactInternalInstance') === 0) {
                    var fiber = el[key];
                    while (fiber) {
                        if (fiber._debugSource) {
                            return {
                                fileName: fiber._debugSource.fileName || null,
                                lineNumber: fiber._debugSource.lineNumber || null,
                                columnNumber: fiber._debugSource.columnNumber || null
                            };
                        }
                        fiber = fiber['return'];
                    }
                    break;
                }
            }
        } catch(e) { console.warn('[studio] getSourceLocation error: ' + e.message); }
        return null;
    }

    function getElementInfo(el) {
        const attrs = {};
        for (const attr of el.attributes) {
            if (attr.name !== 'class' && attr.name !== 'id' && !attr.name.startsWith('__studio')) {
                attrs[attr.name] = attr.value;
            }
        }
        return {
            tagName: el.tagName.toLowerCase(),
            id: el.id || '',
            className: el.className || '',
            textContent: (el.textContent || '').slice(0, 200),
            attributes: attrs,
            sourceLocation: getSourceLocation(el)
        };
    }

    document.addEventListener('mousemove', function(e) {
        if (!inspectMode) {
            hoverOverlay.style.display = 'none';
            label.style.display = 'none';
            return;
        }
        ensureOverlays();
        const el = e.target;
        if (!el || el.id?.startsWith('__studio')) return;
        const rect = el.getBoundingClientRect();
        positionOverlay(hoverOverlay, rect);
        label.textContent = getLabelText(el);
        label.style.left = rect.left + 'px';
        label.style.top = Math.max(0, rect.top - 24) + 'px';
        label.style.display = 'block';
    });

    document.addEventListener('click', function(e) {
        if (!inspectMode) return;
        e.preventDefault();
        e.stopPropagation();
        const el = e.target;
        if (!el || el.id?.startsWith('__studio')) return;
        selectedElement = el;
        const rect = el.getBoundingClientRect();
        positionOverlay(selectOverlay, rect);
        window.parent.postMessage({
            type: '__studio_select',
            element: getElementInfo(el)
        }, '*');
    }, true);

    document.addEventListener('mouseleave', function() {
        hoverOverlay.style.display = 'none';
        label.style.display = 'none';
    });

    window.addEventListener('resize', function() {
        if (selectedElement && selectOverlay.style.display !== 'none') {
            positionOverlay(selectOverlay, selectedElement.getBoundingClientRect());
        }
        hoverOverlay.style.display = 'none';
        label.style.display = 'none';
    });

    window.addEventListener('message', function(e) {
        if (e.data?.type === '__studio_set_inspect_mode') {
            ensureOverlays();
            inspectMode = e.data.enabled;
            if (!inspectMode) {
                hoverOverlay.style.display = 'none';
                label.style.display = 'none';
            }
            document.body.style.cursor = inspectMode ? 'crosshair' : '';
            return;
        }
        if (e.data?.type === '__studio_deselect') {
            selectedElement = null;
            selectOverlay.style.display = 'none';
            return;
        }
        if (!selectedElement) return;
        if (e.data?.type === '__studio_update_text') {
            selectedElement.textContent = e.data.value;
        }
        if (e.data?.type === '__studio_update_attr') {
            selectedElement.setAttribute(e.data.name, e.data.value);
        }
    });
})();
`;
