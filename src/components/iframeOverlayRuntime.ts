/**
 * Iframe overlay runtime — injected into the preview iframe.
 * This file is compiled to a JS string at server startup via Bun.build()
 * and injected as a <script> tag.
 *
 * It runs in the browser context of the preview iframe, so it uses
 * DOM APIs directly. TypeScript types are declared locally since this
 * compiles independently from the main app.
 */

// ── Types (local to this runtime) ──────────────────────────────────

interface Fiber {
  type: unknown;
  _debugSource?: {
    fileName?: string;
    lineNumber?: number;
    columnNumber?: number;
  };
  memoizedProps?: Record<string, unknown>;
  return?: Fiber | null;
  child?: Fiber | null;
  sibling?: Fiber | null;
}

interface MatchedRule {
  selector: string;
  properties: Record<string, string>;
  source: string;
}

interface AvailableClassGroup {
  source: string;
  classes: string[];
}

interface ComponentNode {
  name: string;
  props: Record<string, unknown>;
  children: ComponentNode[];
}

interface StudioMessage {
  type: string;
  enabled?: boolean;
  value?: string;
  name?: string;
  property?: string;
  className?: string;
}

// ── IIFE wrapper ───────────────────────────────────────────────────

(function () {
  let inspectMode = false;
  let selectedElement: HTMLElement | null = null;

  // ── Overlay elements ─────────────────────────────────────────────

  const hoverOverlay = document.createElement("div");
  hoverOverlay.id = "__studio-hover-overlay";
  Object.assign(hoverOverlay.style, {
    position: "fixed",
    pointerEvents: "none",
    border: "2px solid #89b4fa",
    backgroundColor: "rgba(137, 180, 250, 0.08)",
    zIndex: "99998",
    display: "none",
    transition: "all 0.05s ease",
    borderRadius: "2px",
  });

  const selectOverlay = document.createElement("div");
  selectOverlay.id = "__studio-select-overlay";
  Object.assign(selectOverlay.style, {
    position: "fixed",
    pointerEvents: "none",
    border: "2px solid #cba6f7",
    backgroundColor: "rgba(203, 166, 247, 0.08)",
    zIndex: "99999",
    display: "none",
    borderRadius: "2px",
  });

  const label = document.createElement("div");
  label.id = "__studio-label";
  Object.assign(label.style, {
    position: "fixed",
    pointerEvents: "none",
    zIndex: "100000",
    backgroundColor: "#1e1e2e",
    color: "#cdd6f4",
    fontSize: "11px",
    fontFamily: "monospace",
    padding: "2px 8px",
    borderRadius: "3px",
    display: "none",
    whiteSpace: "nowrap",
    border: "1px solid #45475a",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  });

  function ensureOverlays() {
    if (!hoverOverlay.parentNode) document.body.appendChild(hoverOverlay);
    if (!selectOverlay.parentNode) document.body.appendChild(selectOverlay);
    if (!label.parentNode) document.body.appendChild(label);
  }

  ensureOverlays();

  // ── Helpers ──────────────────────────────────────────────────────

  function getLabelText(el: HTMLElement): string {
    let text = el.tagName.toLowerCase();
    if (el.id) text += "#" + el.id;
    if (el.className && typeof el.className === "string") {
      const classes = el.className
        .trim()
        .split(/\s+/)
        .filter((c) => !c.startsWith("__studio"));
      if (classes.length) text += "." + classes.join(".");
    }
    const rect = el.getBoundingClientRect();
    text += "  " + Math.round(rect.width) + "\u00d7" + Math.round(rect.height);
    return text;
  }

  function positionOverlay(overlay: HTMLElement, rect: DOMRect) {
    overlay.style.left = rect.left + "px";
    overlay.style.top = rect.top + "px";
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";
    overlay.style.display = "block";
  }

  // ── React fiber access ───────────────────────────────────────────

  function getReactFiber(el: Element): Fiber | null {
    try {
      const keys = Object.getOwnPropertyNames(el);
      for (const key of keys) {
        if (
          key.startsWith("__reactFiber") ||
          key.startsWith("__reactInternalInstance")
        ) {
          return (el as unknown as Record<string, Fiber>)[key]!;
        }
      }
    } catch {
      // ignore
    }
    return null;
  }

  function getSourceLocation(el: Element) {
    try {
      let fiber = getReactFiber(el);
      while (fiber) {
        if (fiber._debugSource) {
          return {
            fileName: fiber._debugSource.fileName ?? null,
            lineNumber: fiber._debugSource.lineNumber ?? null,
            columnNumber: fiber._debugSource.columnNumber ?? null,
          };
        }
        fiber = fiber.return ?? null;
      }
    } catch (e) {
      console.warn("[studio] getSourceLocation error:", e);
    }
    return null;
  }

  // ── Inline styles ────────────────────────────────────────────────

  function getInlineStyles(el: HTMLElement): Record<string, string> {
    const styles: Record<string, string> = {};
    if (el.style && el.style.length > 0) {
      for (let i = 0; i < el.style.length; i++) {
        const prop = el.style[i]!;
        styles[prop] = el.style.getPropertyValue(prop);
      }
    }
    return styles;
  }

  // ── Element info ─────────────────────────────────────────────────

  interface HandlerInfo {
    name: string;
    source: string;
  }

  function getEventHandlers(el: Element): Record<string, HandlerInfo> {
    const handlers: Record<string, HandlerInfo> = {};
    try {
      const fiber = getReactFiber(el);
      if (fiber?.memoizedProps) {
        const mp = fiber.memoizedProps;
        for (const key in mp) {
          if (
            Object.prototype.hasOwnProperty.call(mp, key) &&
            typeof mp[key] === "function" &&
            /^on[A-Z]/.test(key)
          ) {
            const fn = mp[key] as Function;
            const name = fn.name || "anonymous";
            // Get readable source — truncate to avoid huge payloads
            let source = "";
            try {
              source = fn.toString().slice(0, 200);
            } catch {
              source = "";
            }
            handlers[key] = { name, source };
          }
        }
      }
      // Also check for HTML on* attributes (non-React)
      for (const attr of el.attributes) {
        if (/^on\w+/.test(attr.name) && !handlers[attr.name]) {
          handlers[attr.name] = {
            name: attr.name,
            source: attr.value.slice(0, 200),
          };
        }
      }
    } catch {
      // ignore
    }
    return handlers;
  }

  function getElementInfo(el: HTMLElement) {
    const attrs: Record<string, string> = {};
    for (const attr of el.attributes) {
      if (
        attr.name !== "class" &&
        attr.name !== "id" &&
        !attr.name.startsWith("__studio")
      ) {
        attrs[attr.name] = attr.value;
      }
    }
    return {
      tagName: el.tagName.toLowerCase(),
      id: el.id || "",
      className: el.className || "",
      textContent: (el.textContent || "").slice(0, 200),
      attributes: attrs,
      sourceLocation: getSourceLocation(el),
      inlineStyles: getInlineStyles(el),
      eventHandlers: getEventHandlers(el),
    };
  }

  // ── CSS data extraction ──────────────────────────────────────────

  const VISUAL_PROPERTIES = [
    "font-family",
    "font-size",
    "font-weight",
    "font-style",
    "color",
    "line-height",
    "letter-spacing",
    "text-align",
    "text-transform",
    "text-decoration",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "width",
    "height",
    "min-width",
    "min-height",
    "max-width",
    "max-height",
    "background-color",
    "background-image",
    "border-top-width",
    "border-right-width",
    "border-bottom-width",
    "border-left-width",
    "border-top-style",
    "border-right-style",
    "border-bottom-style",
    "border-left-style",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-bottom-right-radius",
    "border-bottom-left-radius",
    "display",
    "flex-direction",
    "justify-content",
    "align-items",
    "flex-wrap",
    "gap",
    "grid-template-columns",
    "grid-template-rows",
    "opacity",
    "box-shadow",
    "overflow",
    "position",
    "z-index",
  ];

  function getMatchedRules(el: HTMLElement): MatchedRule[] {
    const results: MatchedRule[] = [];
    try {
      for (const sheet of document.styleSheets) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules || sheet.rules;
        } catch {
          continue;
        }
        if (!rules) continue;
        const source = sheet.href || "inline";
        for (const rule of rules) {
          if (!(rule instanceof CSSStyleRule)) continue;
          try {
            if (el.matches(rule.selectorText)) {
              const props: Record<string, string> = {};
              for (let k = 0; k < rule.style.length; k++) {
                const p = rule.style[k]!;
                props[p] = rule.style.getPropertyValue(p);
              }
              results.push({
                selector: rule.selectorText,
                properties: props,
                source,
              });
            }
          } catch {
            // skip invalid selectors
          }
        }
      }
    } catch (e) {
      console.warn("[studio] getMatchedRules error:", e);
    }
    return results;
  }

  function getComputedVisualStyles(el: HTMLElement): Record<string, string> {
    const computed: Record<string, string> = {};
    try {
      const cs = window.getComputedStyle(el);
      for (const prop of VISUAL_PROPERTIES) {
        computed[prop] = cs.getPropertyValue(prop);
      }
    } catch (e) {
      console.warn("[studio] getComputedVisualStyles error:", e);
    }
    return computed;
  }

  function getAvailableClasses(): AvailableClassGroup[] {
    const result: AvailableClassGroup[] = [];
    try {
      for (const sheet of document.styleSheets) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules || sheet.rules;
        } catch {
          continue;
        }
        if (!rules) continue;
        const source = sheet.href || "inline";
        const classes: string[] = [];
        for (const rule of rules) {
          if (!(rule instanceof CSSStyleRule)) continue;
          const sel = rule.selectorText || "";
          const classPattern = /\.[a-zA-Z_][a-zA-Z0-9_-]*/g;
          let m;
          while ((m = classPattern.exec(sel)) !== null) {
            const cls = m[0].slice(1);
            if (!classes.includes(cls)) {
              classes.push(cls);
            }
          }
        }
        if (classes.length > 0) {
          result.push({ source, classes });
        }
      }
    } catch (e) {
      console.warn("[studio] getAvailableClasses error:", e);
    }
    return result;
  }

  // ── Component tree ───────────────────────────────────────────────

  const SKIP_COMPONENTS: Record<string, boolean> = {
    Fragment: true,
    Suspense: true,
    StrictMode: true,
  };

  function getComponentTree(): ComponentNode[] {
    let tree: ComponentNode[] = [];
    try {
      const root =
        document.getElementById("root") ||
        document.getElementById("app") ||
        document.body;
      let fiber = getReactFiber(root);
      if (!fiber) return tree;

      // Walk up to the root fiber
      while (fiber.return) fiber = fiber.return;

      function walkFiber(
        f: Fiber,
        depth: number,
      ): ComponentNode | ComponentNode[] | null {
        if (!f || depth > 30) return null;
        let node: ComponentNode | null = null;

        if (
          typeof f.type === "function" ||
          (typeof f.type === "object" && f.type !== null)
        ) {
          let name: string | null = null;
          if (typeof f.type === "function") {
            name =
              (f.type as { displayName?: string; name?: string }).displayName ||
              (f.type as { name?: string }).name ||
              null;
          } else if (
            f.type &&
            (f.type as { displayName?: string }).displayName
          ) {
            name = (f.type as { displayName: string }).displayName;
          }
          if (name && !SKIP_COMPONENTS[name]) {
            node = { name, props: {}, children: [] };
            if (f.memoizedProps && typeof f.memoizedProps === "object") {
              const mp = f.memoizedProps;
              for (const pk in mp) {
                if (
                  Object.prototype.hasOwnProperty.call(mp, pk) &&
                  pk !== "children" &&
                  pk !== "key" &&
                  pk !== "ref"
                ) {
                  const v = mp[pk];
                  if (
                    typeof v === "string" ||
                    typeof v === "number" ||
                    typeof v === "boolean" ||
                    v === null
                  ) {
                    node.props[pk] = v;
                  } else if (typeof v === "function") {
                    node.props[pk] = "[function]";
                  } else if (Array.isArray(v)) {
                    node.props[pk] = `[array(${v.length})]`;
                  } else if (typeof v === "object") {
                    try {
                      node.props[pk] = JSON.stringify(v).slice(0, 80);
                    } catch {
                      node.props[pk] = "[object]";
                    }
                  }
                }
              }
            }
          }
        }

        // Walk children
        let child = f.child;
        const childResults: ComponentNode[] = [];
        while (child) {
          const result = walkFiber(child, depth + 1);
          if (result) {
            if (Array.isArray(result)) {
              childResults.push(...result);
            } else {
              childResults.push(result);
            }
          }
          child = child.sibling;
        }

        if (node) {
          node.children = childResults;
          return node;
        }
        return childResults.length > 0 ? childResults : null;
      }

      const result = walkFiber(fiber, 0);
      if (result) {
        tree = Array.isArray(result) ? result : [result];
      }
    } catch (e) {
      console.warn("[studio] getComponentTree error:", e);
    }
    return tree;
  }

  // ── Event handlers ───────────────────────────────────────────────

  document.addEventListener("mousemove", (e: MouseEvent) => {
    if (!inspectMode) {
      hoverOverlay.style.display = "none";
      label.style.display = "none";
      return;
    }
    ensureOverlays();
    const el = e.target as HTMLElement | null;
    if (!el || el.id?.startsWith("__studio")) return;
    const rect = el.getBoundingClientRect();
    positionOverlay(hoverOverlay, rect);
    label.textContent = getLabelText(el);
    label.style.left = rect.left + "px";
    label.style.top = Math.max(0, rect.top - 24) + "px";
    label.style.display = "block";
  });

  document.addEventListener(
    "click",
    (e: MouseEvent) => {
      if (!inspectMode) return;
      e.preventDefault();
      e.stopPropagation();
      const el = e.target as HTMLElement | null;
      if (!el || el.id?.startsWith("__studio")) return;
      selectedElement = el;
      const rect = el.getBoundingClientRect();
      positionOverlay(selectOverlay, rect);
      window.parent.postMessage(
        { type: "__studio_select", element: getElementInfo(el) },
        "*",
      );
    },
    true,
  );

  document.addEventListener("mouseleave", () => {
    hoverOverlay.style.display = "none";
    label.style.display = "none";
  });

  window.addEventListener("resize", () => {
    if (selectedElement && selectOverlay.style.display !== "none") {
      positionOverlay(selectOverlay, selectedElement.getBoundingClientRect());
    }
    hoverOverlay.style.display = "none";
    label.style.display = "none";
  });

  window.addEventListener("message", (e: MessageEvent<StudioMessage>) => {
    const msg = e.data;
    if (!msg?.type) return;

    if (msg.type === "__studio_set_inspect_mode") {
      ensureOverlays();
      inspectMode = !!msg.enabled;
      if (!inspectMode) {
        hoverOverlay.style.display = "none";
        label.style.display = "none";
      }
      document.body.style.cursor = inspectMode ? "crosshair" : "";
      return;
    }

    if (msg.type === "__studio_deselect") {
      selectedElement = null;
      selectOverlay.style.display = "none";
      return;
    }

    if (msg.type === "__studio_get_styles") {
      if (!selectedElement) {
        window.parent.postMessage(
          { type: "__studio_styles_result", data: null },
          "*",
        );
        return;
      }
      const styleData = {
        matchedRules: getMatchedRules(selectedElement),
        computedStyles: getComputedVisualStyles(selectedElement),
        availableClasses: getAvailableClasses(),
        inlineStyles: getInlineStyles(selectedElement),
      };
      window.parent.postMessage(
        { type: "__studio_styles_result", data: styleData },
        "*",
      );
      return;
    }

    if (msg.type === "__studio_get_component_tree") {
      const tree = getComponentTree();
      window.parent.postMessage(
        { type: "__studio_component_tree_result", data: tree },
        "*",
      );
      return;
    }

    if (!selectedElement) return;

    if (msg.type === "__studio_update_text") {
      selectedElement.textContent = msg.value!;
    }
    if (msg.type === "__studio_update_attr") {
      selectedElement.setAttribute(msg.name!, msg.value!);
    }
    if (msg.type === "__studio_add_attr") {
      selectedElement.setAttribute(msg.name!, msg.value!);
    }
    if (msg.type === "__studio_update_style") {
      selectedElement.style.setProperty(msg.property!, msg.value!);
    }
    if (msg.type === "__studio_remove_style") {
      selectedElement.style.removeProperty(msg.property!);
    }
    if (msg.type === "__studio_add_class") {
      selectedElement.classList.add(msg.className!);
    }
    if (msg.type === "__studio_remove_class") {
      selectedElement.classList.remove(msg.className!);
    }
  });
})();
