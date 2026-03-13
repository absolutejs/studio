import React from "react";
import type {
  StudioBlockInstance,
  StudioBlockDefinition,
} from "../../types/studio";
import { PropField } from "./PropField";

type PropsPanelProps = {
  block: StudioBlockInstance | null;
  definition: StudioBlockDefinition | null;
  onChange: (blockId: string, propName: string, value: unknown) => void;
};

export const PropsPanel = ({
  block,
  definition,
  onChange,
}: PropsPanelProps) => {
  if (!block || !definition) {
    return (
      <div className="studio-inspector">
        <div className="studio-inspector-empty">
          Select a block to edit its properties
        </div>
      </div>
    );
  }

  return (
    <div className="studio-inspector">
      <div className="studio-inspector-title">Properties</div>
      <div className="studio-inspector-tag">{block.blockName}</div>

      {Object.entries(definition.props).map(([propName, field]) => (
        <div key={propName} className="studio-inspector-field">
          <label className="studio-inspector-label">{field.label}</label>
          <PropField
            field={field}
            value={block.props[propName] ?? field.defaultValue}
            onChange={(value) => onChange(block.id, propName, value)}
          />
        </div>
      ))}
    </div>
  );
};
