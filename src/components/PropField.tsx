import React, { useState } from "react";
import type { StudioPropField } from "../../types/studio";
import { AssetBrowser, FolderIcon } from "./AssetBrowser";

type PropFieldProps = {
  field: StudioPropField;
  value: unknown;
  onChange: (value: unknown) => void;
  assets?: { files: string[]; root: string | null } | null;
};

export const PropField = ({
  field,
  value,
  onChange,
  assets,
}: PropFieldProps) => {
  const [showBrowser, setShowBrowser] = useState(false);
  const hasAssets = assets && assets.files.length > 0;

  switch (field.type) {
    case "string":
      return (
        <input
          className="studio-inspector-value"
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "number":
      return (
        <input
          className="studio-inspector-value"
          type="number"
          value={(value as number) ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );

    case "boolean":
      return (
        <input
          type="checkbox"
          checked={(value as boolean) ?? false}
          onChange={(e) => onChange(e.target.checked)}
        />
      );

    case "select":
      return (
        <select
          className="studio-inspector-value"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt || "(none)"}
            </option>
          ))}
        </select>
      );

    case "color":
      return (
        <input
          type="color"
          value={(value as string) ?? "#000000"}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            height: "32px",
            border: "none",
            cursor: "pointer",
          }}
        />
      );

    case "image":
      return (
        <div>
          <div className={hasAssets ? "studio-asset-input-row" : ""}>
            <input
              className="studio-inspector-value"
              type="text"
              placeholder="Image URL or path"
              value={(value as string) ?? ""}
              onChange={(e) => onChange(e.target.value)}
            />
            {hasAssets && (
              <button
                className="studio-btn studio-btn-sm studio-asset-browse-btn"
                onClick={() => setShowBrowser(!showBrowser)}
                title="Browse assets"
              >
                <FolderIcon />
              </button>
            )}
          </div>
          {showBrowser && assets && (
            <AssetBrowser
              files={assets.files}
              root={assets.root}
              onSelect={(path) => {
                onChange(path);
                setShowBrowser(false);
              }}
              onClose={() => setShowBrowser(false)}
            />
          )}
        </div>
      );

    default:
      return (
        <input
          className="studio-inspector-value"
          type="text"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};
