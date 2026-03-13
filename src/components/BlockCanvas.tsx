import React from "react";
import type { StudioBlockInstance } from "../../types/studio";
import { BlockItem } from "./BlockItem";

type BlockCanvasProps = {
  blocks: StudioBlockInstance[];
  onSelectBlock: (id: string) => void;
  selectedBlockId: string | null;
};

export const BlockCanvas = ({
  blocks,
  onSelectBlock,
  selectedBlockId,
}: BlockCanvasProps) => (
  <div
    className="studio-block-canvas"
    style={{
      flex: 1,
      padding: "24px",
      overflowY: "auto",
      backgroundColor: "var(--studio-bg)",
    }}
  >
    {blocks.length === 0 && (
      <div
        style={{
          textAlign: "center",
          color: "var(--studio-text-muted)",
          paddingTop: "80px",
        }}
      >
        <p style={{ fontSize: "15px" }}>No blocks yet</p>
        <p style={{ fontSize: "13px" }}>
          Add blocks from the sidebar to get started
        </p>
      </div>
    )}
    {blocks.map((block) => (
      <BlockItem
        key={block.id}
        block={block}
        onSelect={onSelectBlock}
        selected={block.id === selectedBlockId}
      />
    ))}
  </div>
);
