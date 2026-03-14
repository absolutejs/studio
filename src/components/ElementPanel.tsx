import { useState, useEffect } from "react";
import { AssetBrowser, FolderIcon } from "./AssetBrowser";

type SelectedElement = {
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
};

type ElementPanelProps = {
  selectedElement: SelectedElement | null;
  onTextChange: (value: string) => void;
  onAttributeChange: (name: string, value: string, oldValue?: string) => void;
  assets?: { files: string[]; root: string | null } | null;
};

/** Attributes that reference assets, keyed by tag */
const ASSET_ATTRS: Record<string, string[]> = {
  img: ["src"],
  video: ["src", "poster"],
  audio: ["src"],
  source: ["src"],
  link: ["href"],
  image: ["href"],
};

export const ElementPanel = ({
  selectedElement,
  onTextChange,
  onAttributeChange,
  assets,
}: ElementPanelProps) => {
  const [editText, setEditText] = useState("");
  const [editAttrs, setEditAttrs] = useState<Record<string, string>>({});
  const [browsingAttr, setBrowsingAttr] = useState<string | null>(null);

  useEffect(() => {
    if (selectedElement) {
      setEditText(selectedElement.textContent.slice(0, 100));
      setEditAttrs({ ...selectedElement.attributes });
      setBrowsingAttr(null);
    }
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

  const handleTextChange = (value: string) => {
    setEditText(value);
    onTextChange(value);
  };

  const handleAttrChange = (name: string, value: string) => {
    const oldValue = editAttrs[name] ?? "";
    setEditAttrs((prev) => ({ ...prev, [name]: value }));
    onAttributeChange(name, value, oldValue);
  };

  const tag = selectedElement.tagName.toLowerCase();
  const assetAttrs = ASSET_ATTRS[tag] ?? [];
  const hasAssets = assets && assets.files.length > 0;

  return (
    <div>
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
                <div className={isAssetAttr ? "studio-asset-input-row" : ""}>
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
    </div>
  );
};
