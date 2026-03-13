import React from "react";
import type { StudioBlockInstance } from "../../types/studio";

type BlockItemProps = {
  block: StudioBlockInstance;
  onSelect: (id: string) => void;
  selected: boolean;
};

export const BlockItem = ({ block, onSelect, selected }: BlockItemProps) => (
  <div
    className={`studio-block-item ${selected ? "studio-block-item-selected" : ""}`}
    onClick={() => onSelect(block.id)}
    style={{
      padding: "12px 16px",
      border: selected
        ? "2px solid var(--studio-blue)"
        : "1px solid var(--studio-border)",
      borderRadius: "var(--studio-radius)",
      marginBottom: "8px",
      cursor: "pointer",
      backgroundColor: selected ? "var(--studio-surface)" : "transparent",
    }}
  >
    <div
      style={{
        fontSize: "13px",
        fontFamily: "var(--studio-font-mono)",
        color: "var(--studio-text)",
      }}
    >
      {block.blockName}
    </div>
    <div
      style={{
        fontSize: "11px",
        color: "var(--studio-text-muted)",
        marginTop: "4px",
      }}
    >
      {Object.entries(block.props)
        .slice(0, 2)
        .map(([key, val]) => `${key}: ${String(val).slice(0, 20)}`)
        .join(", ")}
    </div>
  </div>
);
