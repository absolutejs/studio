import React from "react";
import type { StudioBlockDefinition } from "../../types/studio";

type BlockPaletteProps = {
  blocks: StudioBlockDefinition[];
  onAddBlock: (block: StudioBlockDefinition) => void;
};

export const BlockPalette = ({ blocks, onAddBlock }: BlockPaletteProps) => {
  const categories = [...new Set(blocks.map((b) => b.category))];

  return (
    <div className="studio-elements-list">
      {categories.map((category) => (
        <div key={category}>
          <div className="studio-element-category">{category}</div>
          {blocks
            .filter((b) => b.category === category)
            .map((block) => (
              <div
                key={block.name}
                className="studio-element-item"
                onClick={() => onAddBlock(block)}
                title={block.description}
              >
                {block.name}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};
