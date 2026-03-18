import { useState, useEffect, useMemo, useCallback } from "react";
import { AssetBrowser, FolderIcon } from "./AssetBrowser";
import { StyleEditor } from "./StyleEditor";
import type { StyleData } from "./StyleEditor";
import { getAttributesForElement } from "./htmlAttributes";
import type { AttributeMeta } from "./htmlAttributes";

export type HandlerInfo = { name: string; source: string };

export type SelectedElement = {
  tagName: string;
  id: string;
  className: string;
  textContent: string;
  attributes: Record<string, string>;
  sourceLocation?: {
    fileName: string | null;
    lineNumber: number | null;
    columnNumber: number | null;
  } | null;
  inlineStyles?: Record<string, string> | null;
  eventHandlers?: Record<string, HandlerInfo> | null;
};

export type InteractionAction = {
  type: "navigate" | "toggleClass" | "toggleVisibility" | "alert" | "custom";
  label: string;
  description: string;
};

type ElementPanelProps = {
  selectedElement: SelectedElement | null;
  onTextChange: (value: string) => void;
  onAttributeChange: (name: string, value: string, oldValue?: string) => void;
  onAddAttribute: (name: string, value: string) => void;
  onStyleChange: (property: string, value: string) => void;
  onStyleRemove: (property: string) => void;
  onClassAdd: (className: string) => void;
  onClassRemove: (className: string) => void;
  onInteractionAdd: (event: string, action: string, code: string) => void;
  onInteractionRemove: (event: string) => void;
  assets?: { files: string[]; root: string | null } | null;
  styleData?: StyleData;
  isJSX?: boolean;
};

type InspectorTab = "attributes" | "styles" | "interactions";

/** Attributes that reference assets, keyed by tag */
const ASSET_ATTRS: Record<string, string[]> = {
  img: ["src"],
  video: ["src", "poster"],
  audio: ["src"],
  source: ["src"],
  link: ["href"],
  image: ["href"],
};

const EVENT_OPTIONS = [
  { value: "Click", jsxProp: "onClick", htmlAttr: "onclick" },
  { value: "Double Click", jsxProp: "onDoubleClick", htmlAttr: "ondblclick" },
  { value: "Mouse Enter", jsxProp: "onMouseEnter", htmlAttr: "onmouseenter" },
  { value: "Mouse Leave", jsxProp: "onMouseLeave", htmlAttr: "onmouseleave" },
  { value: "Focus", jsxProp: "onFocus", htmlAttr: "onfocus" },
  { value: "Blur", jsxProp: "onBlur", htmlAttr: "onblur" },
  { value: "Submit", jsxProp: "onSubmit", htmlAttr: "onsubmit" },
  { value: "Change", jsxProp: "onChange", htmlAttr: "onchange" },
  { value: "Key Down", jsxProp: "onKeyDown", htmlAttr: "onkeydown" },
];

const ACTION_TEMPLATES: InteractionAction[] = [
  {
    type: "navigate",
    label: "Navigate to page",
    description: "Go to a URL or route when triggered",
  },
  {
    type: "toggleClass",
    label: "Toggle CSS class",
    description: "Add or remove a class on this element",
  },
  {
    type: "toggleVisibility",
    label: "Show / Hide",
    description: "Toggle the visibility of this element",
  },
  {
    type: "alert",
    label: "Show alert",
    description: "Display a message popup",
  },
  {
    type: "custom",
    label: "Custom code",
    description: "Write your own handler code",
  },
];

/** Convert JSX prop name (onClick) to human label */
function eventPropToLabel(prop: string): string {
  // onClick → Click, onMouseEnter → Mouse Enter
  const found = EVENT_OPTIONS.find(
    (e) => e.jsxProp === prop || e.htmlAttr === prop,
  );
  if (found) return found.value;
  const name = prop.replace(/^on/, "");
  return name.replace(/([A-Z])/g, " $1").trim();
}

/** Try to describe what a handler does from its source */
function describeHandler(source: string): string {
  if (!source) return "Custom handler";
  const s = source.trim();

  // Navigate patterns
  const navMatch =
    s.match(/window\.location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/) ??
    s.match(/navigate\(\s*['"]([^'"]+)['"]/) ??
    s.match(/router\.push\(\s*['"]([^'"]+)['"]/);
  if (navMatch) return `Navigate to ${navMatch[1]}`;

  // Alert
  const alertMatch = s.match(/alert\(\s*['"]([^'"]*)['"]\s*\)/);
  if (alertMatch) return `Alert: "${alertMatch[1]}"`;

  // Toggle class
  if (s.includes("classList.toggle")) return "Toggle CSS class";
  if (s.includes("classList.add")) return "Add CSS class";
  if (s.includes("classList.remove")) return "Remove CSS class";

  // Visibility
  if (s.includes("display") && (s.includes("none") || s.includes("block")))
    return "Toggle visibility";

  // State setter
  const stateMatch = s.match(/set(\w+)\(/);
  if (stateMatch) return `Update ${stateMatch[1]!.toLowerCase()}`;

  // console.log
  if (s.includes("console.log")) return "Log to console";

  // Named function
  const nameMatch = s.match(/^(?:function\s+)?(\w+)\s*\(/);
  if (nameMatch && nameMatch[1] !== "function") return `Call ${nameMatch[1]}()`;

  // Arrow with body
  if (s.length < 80) return s;

  return "Custom handler";
}

/** Build handler code from action template */
function buildHandlerCode(
  action: InteractionAction["type"],
  params: Record<string, string>,
  isJSX: boolean,
): string {
  switch (action) {
    case "navigate": {
      const url = params.url || "/";
      return isJSX
        ? `() => { window.location.href = '${url}'; }`
        : `window.location.href='${url}'`;
    }
    case "toggleClass": {
      const cls = params.className || "active";
      return isJSX
        ? `(e) => { e.currentTarget.classList.toggle('${cls}'); }`
        : `this.classList.toggle('${cls}')`;
    }
    case "toggleVisibility":
      return isJSX
        ? `(e) => { const s = e.currentTarget.style; s.display = s.display === 'none' ? '' : 'none'; }`
        : `this.style.display = this.style.display === 'none' ? '' : 'none'`;
    case "alert": {
      const msg = params.message || "Hello!";
      return isJSX
        ? `() => { alert('${msg.replace(/'/g, "\\'")}'); }`
        : `alert('${msg.replace(/'/g, "\\'")}')`;
    }
    case "custom":
      return isJSX ? params.code || "() => { }" : params.code || "";
  }
}

// ── Interaction Builder sub-component ──────────────────────────────

const InteractionBuilder = ({
  isJSX,
  existingEvents,
  onAdd,
  onCancel,
}: {
  isJSX: boolean;
  existingEvents: Set<string>;
  onAdd: (event: string, action: string, code: string) => void;
  onCancel: () => void;
}) => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedAction, setSelectedAction] =
    useState<InteractionAction["type"]>("navigate");
  const [params, setParams] = useState<Record<string, string>>({});

  const availableEvents = EVENT_OPTIONS.filter(
    (e) => !existingEvents.has(e.jsxProp) && !existingEvents.has(e.htmlAttr),
  );

  const updateParam = (key: string, value: string) =>
    setParams((prev) => ({ ...prev, [key]: value }));

  const handleAdd = () => {
    if (!selectedEvent) return;
    const ev = EVENT_OPTIONS.find((e) => e.value === selectedEvent);
    if (!ev) return;
    const eventProp = isJSX ? ev.jsxProp : ev.htmlAttr;
    const code = buildHandlerCode(selectedAction, params, isJSX);
    const actionLabel =
      ACTION_TEMPLATES.find((a) => a.type === selectedAction)?.label ??
      selectedAction;
    onAdd(eventProp, actionLabel, code);
  };

  return (
    <div className="studio-interaction-builder">
      <div className="studio-interaction-builder-title">Add Interaction</div>

      {/* Event picker */}
      <div className="studio-design-field">
        <label className="studio-design-label">When</label>
        <select
          className="studio-inspector-value"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">Choose event...</option>
          {availableEvents.map((ev) => (
            <option key={ev.value} value={ev.value}>
              {ev.value}
            </option>
          ))}
        </select>
      </div>

      {/* Action picker */}
      {selectedEvent && (
        <>
          <div className="studio-design-field">
            <label className="studio-design-label">Do</label>
            <div className="studio-interaction-actions">
              {ACTION_TEMPLATES.map((action) => (
                <button
                  key={action.type}
                  className={`studio-interaction-action-btn ${selectedAction === action.type ? "active" : ""}`}
                  onClick={() => {
                    setSelectedAction(action.type);
                    setParams({});
                  }}
                >
                  <span className="studio-interaction-action-label">
                    {action.label}
                  </span>
                  <span className="studio-interaction-action-desc">
                    {action.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action parameters */}
          {selectedAction === "navigate" && (
            <div className="studio-design-field">
              <label className="studio-design-label">URL or path</label>
              <input
                className="studio-inspector-value"
                placeholder="/about or https://..."
                value={params.url ?? ""}
                onChange={(e) => updateParam("url", e.target.value)}
              />
            </div>
          )}

          {selectedAction === "toggleClass" && (
            <div className="studio-design-field">
              <label className="studio-design-label">Class name</label>
              <input
                className="studio-inspector-value"
                placeholder="active"
                value={params.className ?? ""}
                onChange={(e) => updateParam("className", e.target.value)}
              />
            </div>
          )}

          {selectedAction === "alert" && (
            <div className="studio-design-field">
              <label className="studio-design-label">Message</label>
              <input
                className="studio-inspector-value"
                placeholder="Hello!"
                value={params.message ?? ""}
                onChange={(e) => updateParam("message", e.target.value)}
              />
            </div>
          )}

          {selectedAction === "custom" && (
            <div className="studio-design-field">
              <label className="studio-design-label">Code</label>
              <textarea
                className="studio-inspector-value studio-interaction-code"
                placeholder={
                  isJSX ? "() => { /* your code */ }" : "/* your code */"
                }
                value={params.code ?? ""}
                onChange={(e) => updateParam("code", e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Preview */}
          <div className="studio-interaction-preview">
            <div className="studio-design-label">Preview</div>
            <code className="studio-interaction-preview-code">
              {isJSX
                ? `${EVENT_OPTIONS.find((e) => e.value === selectedEvent)?.jsxProp}={${buildHandlerCode(selectedAction, params, true)}}`
                : `${EVENT_OPTIONS.find((e) => e.value === selectedEvent)?.htmlAttr}="${buildHandlerCode(selectedAction, params, false)}"`}
            </code>
          </div>

          <div className="studio-interaction-builder-actions">
            <button className="studio-btn studio-btn-sm" onClick={onCancel}>
              Cancel
            </button>
            <button
              className="studio-btn studio-btn-sm studio-btn-primary"
              onClick={handleAdd}
              disabled={!selectedEvent}
            >
              Add
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ── Main ElementPanel ──────────────────────────────────────────────

export const ElementPanel = ({
  selectedElement,
  onTextChange,
  onAttributeChange,
  onAddAttribute,
  onStyleChange,
  onStyleRemove,
  onClassAdd,
  onClassRemove,
  onInteractionAdd,
  onInteractionRemove,
  assets,
  styleData,
  isJSX = false,
}: ElementPanelProps) => {
  const [editText, setEditText] = useState("");
  const [editAttrs, setEditAttrs] = useState<Record<string, string>>({});
  const [browsingAttr, setBrowsingAttr] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<InspectorTab>("attributes");
  const [showAvailable, setShowAvailable] = useState(false);
  const [attrSearch, setAttrSearch] = useState("");
  const [showAddInteraction, setShowAddInteraction] = useState(false);

  useEffect(() => {
    if (selectedElement) {
      setEditText(selectedElement.textContent.slice(0, 100));
      setEditAttrs({ ...selectedElement.attributes });
      setBrowsingAttr(null);
      setAttrSearch("");
      setActiveTab("attributes");
      setShowAddInteraction(false);
    }
  }, [selectedElement]);

  const availableAttrs = useMemo(() => {
    if (!selectedElement) return { global: [], specific: [] };
    const existing = new Set([...Object.keys(editAttrs), "class", "id"]);
    return getAttributesForElement(selectedElement.tagName, existing);
  }, [selectedElement, editAttrs]);

  const filteredAvailable = useMemo(() => {
    const search = attrSearch.toLowerCase();
    const filter = (attrs: AttributeMeta[]) =>
      search
        ? attrs.filter(
            (a) =>
              a.name.toLowerCase().includes(search) ||
              a.description.toLowerCase().includes(search),
          )
        : attrs;
    return {
      specific: filter(availableAttrs.specific),
      global: filter(availableAttrs.global),
    };
  }, [availableAttrs, attrSearch]);

  const classes = useMemo(() => {
    if (!selectedElement?.className) return [];
    const cn = selectedElement.className;
    if (typeof cn !== "string") return [];
    return cn.trim().split(/\s+/).filter(Boolean);
  }, [selectedElement]);

  const handleTextChange = useCallback(
    (value: string) => {
      setEditText(value);
      onTextChange(value);
    },
    [onTextChange],
  );

  const handleAttrChange = useCallback(
    (name: string, value: string) => {
      const oldValue = editAttrs[name] ?? "";
      setEditAttrs((prev) => ({ ...prev, [name]: value }));
      onAttributeChange(name, value, oldValue);
    },
    [editAttrs, onAttributeChange],
  );

  const handleAddAvailableAttr = useCallback(
    (attr: AttributeMeta) => {
      const defaultValue = attr.type === "boolean" ? "" : "";
      setEditAttrs((prev) => ({ ...prev, [attr.name]: defaultValue }));
      onAddAttribute(attr.name, defaultValue);
      setShowAvailable(false);
      setAttrSearch("");
    },
    [onAddAttribute],
  );

  const existingEventSet = useMemo(() => {
    const set = new Set<string>();
    if (selectedElement?.eventHandlers) {
      for (const key of Object.keys(selectedElement.eventHandlers)) {
        set.add(key);
      }
    }
    return set;
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <div className="studio-inspector-empty">
        <p>
          Click the <strong>Select</strong> button in the toolbar, then click an
          element in the preview to inspect it.
        </p>
      </div>
    );
  }

  const tag = selectedElement.tagName.toLowerCase();
  const assetAttrs = ASSET_ATTRS[tag] ?? [];
  const hasAssets = assets && assets.files.length > 0;
  const handlers = selectedElement.eventHandlers ?? {};
  const handlerCount = Object.keys(handlers).length;
  const tabs: { key: InspectorTab; label: string }[] = [
    { key: "attributes", label: "Attrs" },
    { key: "styles", label: "Styles" },
    {
      key: "interactions",
      label: `Events${handlerCount > 0 ? ` (${handlerCount})` : ""}`,
    },
  ];

  return (
    <div>
      {/* Element identity */}
      <div className="studio-inspector-section">
        <div className="studio-inspector-tag">
          &lt;{selectedElement.tagName}&gt;
        </div>

        {selectedElement.id && (
          <div className="studio-inspector-field">
            <label className="studio-inspector-label">ID</label>
            <span className="studio-inspector-value">
              #{selectedElement.id}
            </span>
          </div>
        )}

        {selectedElement.className && (
          <div className="studio-inspector-field">
            <label className="studio-inspector-label">Classes</label>
            <span className="studio-inspector-value">
              {typeof selectedElement.className === "string"
                ? selectedElement.className
                    .trim()
                    .split(/\s+/)
                    .map((cls) => `.${cls}`)
                    .join(" ")
                : ""}
            </span>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="studio-inspector-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`studio-inspector-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Attributes Tab */}
      {activeTab === "attributes" && (
        <div>
          {/* Text content */}
          <div className="studio-inspector-section">
            <div className="studio-inspector-field">
              <label className="studio-inspector-label">Text</label>
              <input
                className="studio-inspector-value"
                value={editText}
                onChange={(e) => handleTextChange(e.target.value)}
              />
            </div>
          </div>

          {/* Existing attributes */}
          {Object.keys(editAttrs).length > 0 && (
            <div className="studio-inspector-section">
              <div
                className="studio-inspector-label"
                style={{ marginBottom: 8, fontWeight: 600 }}
              >
                Attributes
              </div>
              {Object.entries(editAttrs).map(([name, value]) => {
                const isAssetAttr = hasAssets && assetAttrs.includes(name);

                return (
                  <div className="studio-inspector-field" key={name}>
                    <label className="studio-inspector-label">{name}</label>
                    <div
                      className={isAssetAttr ? "studio-asset-input-row" : ""}
                    >
                      <input
                        className="studio-inspector-value"
                        value={value}
                        onChange={(e) => handleAttrChange(name, e.target.value)}
                      />
                      {isAssetAttr && (
                        <button
                          className="studio-btn studio-btn-sm studio-asset-browse-btn"
                          onClick={() =>
                            setBrowsingAttr(browsingAttr === name ? null : name)
                          }
                          title="Browse assets"
                        >
                          <FolderIcon />
                        </button>
                      )}
                    </div>
                    {browsingAttr === name && assets && (
                      <AssetBrowser
                        files={assets.files}
                        root={assets.root}
                        onSelect={(path) => {
                          handleAttrChange(name, path);
                          setBrowsingAttr(null);
                        }}
                        onClose={() => setBrowsingAttr(null)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Available attributes */}
          <div className="studio-inspector-section">
            <button
              className="studio-btn studio-btn-sm studio-available-attrs-toggle"
              onClick={() => setShowAvailable(!showAvailable)}
            >
              {showAvailable ? "Hide" : "Add attribute..."}
            </button>

            {showAvailable && (
              <div className="studio-available-attrs">
                <input
                  className="studio-inspector-value"
                  placeholder="Search attributes..."
                  value={attrSearch}
                  onChange={(e) => setAttrSearch(e.target.value)}
                  style={{ marginBottom: 8, marginTop: 8 }}
                />

                {/* Element-specific attributes */}
                {filteredAvailable.specific.length > 0 && (
                  <div className="studio-available-attrs-group">
                    <div className="studio-available-attrs-group-title">
                      {tag} attributes
                    </div>
                    {filteredAvailable.specific.map((attr) => (
                      <button
                        key={attr.name}
                        className="studio-available-attr-item"
                        onClick={() => handleAddAvailableAttr(attr)}
                        title={attr.description}
                      >
                        <span className="studio-available-attr-name">
                          {attr.name}
                        </span>
                        <span className="studio-available-attr-type">
                          {attr.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Global attributes */}
                {filteredAvailable.global.length > 0 && (
                  <div className="studio-available-attrs-group">
                    <div className="studio-available-attrs-group-title">
                      Global attributes
                    </div>
                    {filteredAvailable.global.map((attr) => (
                      <button
                        key={attr.name}
                        className="studio-available-attr-item"
                        onClick={() => handleAddAvailableAttr(attr)}
                        title={attr.description}
                      >
                        <span className="studio-available-attr-name">
                          {attr.name}
                        </span>
                        <span className="studio-available-attr-type">
                          {attr.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredAvailable.specific.length === 0 &&
                  filteredAvailable.global.length === 0 && (
                    <div className="studio-available-attrs-empty">
                      No matching attributes
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactions Tab */}
      {activeTab === "interactions" && (
        <div className="studio-inspector-section">
          {/* Existing handlers */}
          {handlerCount > 0 ? (
            <div className="studio-interaction-list">
              {Object.entries(handlers).map(([event, info]) => (
                <div key={event} className="studio-interaction-item">
                  <div className="studio-interaction-item-header">
                    <span className="studio-interaction-event">
                      {eventPropToLabel(event)}
                    </span>
                    <button
                      className="studio-btn studio-btn-icon studio-btn-sm studio-design-reset"
                      onClick={() => onInteractionRemove(event)}
                      title="Remove interaction"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="studio-interaction-item-desc">
                    {describeHandler(info.source)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="studio-inspector-empty-text">
              No event handlers on this element
            </div>
          )}

          {/* Add interaction */}
          {showAddInteraction ? (
            <InteractionBuilder
              isJSX={isJSX}
              existingEvents={existingEventSet}
              onAdd={(event, action, code) => {
                onInteractionAdd(event, action, code);
                setShowAddInteraction(false);
              }}
              onCancel={() => setShowAddInteraction(false)}
            />
          ) : (
            <button
              className="studio-btn studio-btn-sm studio-available-attrs-toggle"
              style={{ marginTop: 8 }}
              onClick={() => setShowAddInteraction(true)}
            >
              Add interaction...
            </button>
          )}
        </div>
      )}

      {/* Styles Tab */}
      {activeTab === "styles" && (
        <StyleEditor
          styleData={styleData ?? null}
          classes={classes}
          onStyleChange={onStyleChange}
          onStyleRemove={onStyleRemove}
          onClassAdd={onClassAdd}
          onClassRemove={onClassRemove}
        />
      )}
    </div>
  );
};
