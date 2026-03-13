export const iframeOverlayScript = `
(function() {
    const hoverOverlay = document.createElement('div');
    hoverOverlay.id = '__studio-hover-overlay';
    Object.assign(hoverOverlay.style, {
        position: 'fixed', pointerEvents: 'none', border: '2px solid #4f9eff',
        backgroundColor: 'rgba(79, 158, 255, 0.1)', zIndex: '99998',
        display: 'none', transition: 'all 0.1s ease'
    });
    document.body.appendChild(hoverOverlay);

    const selectOverlay = document.createElement('div');
    selectOverlay.id = '__studio-select-overlay';
    Object.assign(selectOverlay.style, {
        position: 'fixed', pointerEvents: 'none', border: '2px solid #ff6b35',
        backgroundColor: 'rgba(255, 107, 53, 0.1)', zIndex: '99999',
        display: 'none'
    });
    document.body.appendChild(selectOverlay);

    const label = document.createElement('div');
    label.id = '__studio-label';
    Object.assign(label.style, {
        position: 'fixed', pointerEvents: 'none', zIndex: '100000',
        backgroundColor: '#1e1e2e', color: '#cdd6f4', fontSize: '11px',
        fontFamily: 'monospace', padding: '2px 6px', borderRadius: '3px',
        display: 'none', whiteSpace: 'nowrap'
    });
    document.body.appendChild(label);

    let selectedElement = null;

    function getLabelText(el) {
        let text = el.tagName.toLowerCase();
        if (el.id) text += '#' + el.id;
        if (el.className && typeof el.className === 'string') {
            text += '.' + el.className.trim().split(/\\s+/).join('.');
        }
        return text;
    }

    function positionOverlay(overlay, rect) {
        overlay.style.left = rect.left + 'px';
        overlay.style.top = rect.top + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
        overlay.style.display = 'block';
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
            attributes: attrs
        };
    }

    document.addEventListener('mousemove', function(e) {
        const el = e.target;
        if (!el || el.id?.startsWith('__studio')) return;
        const rect = el.getBoundingClientRect();
        positionOverlay(hoverOverlay, rect);
        label.textContent = getLabelText(el);
        label.style.left = rect.left + 'px';
        label.style.top = Math.max(0, rect.top - 20) + 'px';
        label.style.display = 'block';
    });

    document.addEventListener('click', function(e) {
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

    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' || e.target.closest('a')) {
            e.preventDefault();
        }
    }, true);

    document.addEventListener('mouseleave', function() {
        hoverOverlay.style.display = 'none';
        label.style.display = 'none';
    });

    window.addEventListener('message', function(e) {
        if (!selectedElement) return;
        if (e.data.type === '__studio_update_text') {
            selectedElement.textContent = e.data.value;
        }
        if (e.data.type === '__studio_update_attr') {
            selectedElement.setAttribute(e.data.name, e.data.value);
        }
    });
})();
`
