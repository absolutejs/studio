import { useState, useRef, useMemo, useCallback } from "react";

type MatchedRule = {
  selector: string;
  properties: Record<string, string>;
  source: string;
};

type AvailableClassGroup = {
  source: string;
  classes: string[];
};

export type StyleData = {
  matchedRules: MatchedRule[];
  computedStyles: Record<string, string>;
  availableClasses: AvailableClassGroup[];
  inlineStyles: Record<string, string>;
} | null;

type StyleEditorProps = {
  styleData: StyleData;
  classes: string[];
  onStyleChange: (property: string, value: string) => void;
  onStyleRemove: (property: string) => void;
  onClassAdd: (className: string) => void;
  onClassRemove: (className: string) => void;
};

type StyleSubTab = "design" | "rules" | "classes";

// ── Font weight labels ─────────────────────────────────────────────
const FONT_WEIGHTS = [
  { value: "100", label: "Thin" },
  { value: "200", label: "Extra Light" },
  { value: "300", label: "Light" },
  { value: "400", label: "Normal" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
  { value: "900", label: "Black" },
];

const DISPLAY_OPTIONS = [
  "block",
  "flex",
  "grid",
  "inline",
  "inline-block",
  "none",
];
const FLEX_DIRECTION_OPTIONS = [
  "row",
  "row-reverse",
  "column",
  "column-reverse",
];
const JUSTIFY_OPTIONS = [
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
];
const ALIGN_OPTIONS = [
  "flex-start",
  "flex-end",
  "center",
  "baseline",
  "stretch",
];
const FLEX_WRAP_OPTIONS = ["nowrap", "wrap", "wrap-reverse"];
const BORDER_STYLE_OPTIONS = ["none", "solid", "dashed", "dotted", "double"];
const TEXT_TRANSFORM_OPTIONS = ["none", "capitalize", "uppercase", "lowercase"];
const TEXT_DECORATION_OPTIONS = [
  "none",
  "underline",
  "overline",
  "line-through",
];
const FONT_STYLE_OPTIONS = ["normal", "italic"];

// ── Utilities ──────────────────────────────────────────────────────

function rgbToHex(rgb: string): string {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return "";
  return (
    "#" +
    [m[1], m[2], m[3]]
      .map((n) => parseInt(n!, 10).toString(16).padStart(2, "0"))
      .join("")
  );
}

function isTransparentOrNone(val: string | undefined): boolean {
  if (!val) return true;
  const v = val.trim().toLowerCase();
  return (
    v === "" || v === "transparent" || v === "rgba(0, 0, 0, 0)" || v === "none"
  );
}

function getUnit(value: string): string {
  const m = value.match(/(px|rem|%|em|vw|vh|auto)$/);
  return m ? m[1]! : "px";
}

function shortenSource(source: string): string {
  if (source === "inline") return "inline";
  try {
    const url = new URL(source);
    const path = url.pathname;
    const parts = path.split("/");
    return parts[parts.length - 1] ?? path;
  } catch {
    return source.split("/").pop() ?? source;
  }
}

// ── Helper components ──────────────────────────────────────────────

const SectionHeader = ({
  label,
  expanded,
  onToggle,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
}) => (
  <button className="studio-design-section-header" onClick={onToggle}>
    <span className="studio-style-category-arrow">
      {expanded ? "\u25BE" : "\u25B8"}
    </span>
    {label}
  </button>
);

/** Debounced color input — only fires onChange after user stops dragging */
const DebouncedColorInput = ({
  value,
  computedHex,
  hasColor,
  onChange,
  onRemove,
}: {
  value: string | undefined;
  computedHex: string;
  hasColor: boolean;
  onChange: (value: string) => void;
  onRemove: () => void;
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localValue, setLocalValue] = useState<string | null>(null);
  const hasOverride = value !== undefined && value !== "";

  const handleColorChange = (hex: string) => {
    setLocalValue(hex);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(hex);
      setLocalValue(null);
    }, 150);
  };

  const displayHex =
    localValue ?? (value?.startsWith("#") ? value : computedHex);

  return (
    <div className="studio-design-input-row">
      <div className="studio-design-color-row">
        <div className="studio-color-swatch-wrap">
          <input
            type="color"
            className="studio-style-color-input"
            value={displayHex || "#000000"}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          {!hasColor && !localValue && (
            <div className="studio-color-swatch-empty" />
          )}
        </div>
        <input
          className="studio-inspector-value studio-design-value"
          value={localValue ?? value ?? ""}
          placeholder={hasColor ? computedHex : "none"}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {hasOverride && (
        <button
          className="studio-btn studio-btn-icon studio-btn-sm studio-design-reset"
          onClick={onRemove}
          title="Remove color"
        >
          &times;
        </button>
      )}
    </div>
  );
};

const StyleInput = ({
  value,
  computed,
  onChange,
  onRemove,
  type = "text",
  units,
}: {
  property?: string;
  value: string | undefined;
  computed: string | undefined;
  onChange: (value: string) => void;
  onRemove: () => void;
  type?: "text" | "number";
  units?: string[];
}) => {
  const hasOverride = value !== undefined && value !== "";
  return (
    <div className="studio-design-input-row">
      <div className="studio-design-value-group">
        <input
          className="studio-inspector-value studio-design-value"
          type={type}
          value={value ?? ""}
          placeholder={computed ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
        {units && (
          <select
            className="studio-design-unit-select"
            value={getUnit(value ?? computed ?? "")}
            onChange={(e) => {
              const num = parseFloat(value ?? computed ?? "0");
              if (!isNaN(num)) onChange(num + e.target.value);
            }}
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        )}
      </div>
      {hasOverride && (
        <button
          className="studio-btn studio-btn-icon studio-btn-sm studio-design-reset"
          onClick={onRemove}
          title="Reset to default"
        >
          &times;
        </button>
      )}
    </div>
  );
};

const SelectInput = ({
  value,
  computed,
  options,
  onChange,
  onRemove,
}: {
  value: string | undefined;
  computed: string | undefined;
  options: string[];
  onChange: (value: string) => void;
  onRemove: () => void;
}) => {
  const hasOverride = value !== undefined && value !== "";
  return (
    <div className="studio-design-input-row">
      <select
        className="studio-inspector-value studio-design-value"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{computed ?? "\u2014"}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {hasOverride && (
        <button
          className="studio-btn studio-btn-icon studio-btn-sm studio-design-reset"
          onClick={onRemove}
          title="Reset to default"
        >
          &times;
        </button>
      )}
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────

export const StyleEditor = ({
  styleData,
  classes,
  onStyleChange,
  onStyleRemove,
  onClassAdd,
  onClassRemove,
}: StyleEditorProps) => {
  const [subTab, setSubTab] = useState<StyleSubTab>("design");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(["Typography", "Spacing"]),
  );
  const [classSearch, setClassSearch] = useState("");
  const [newClass, setNewClass] = useState("");

  const inlineStyles = styleData?.inlineStyles ?? {};
  const computed = styleData?.computedStyles ?? {};

  const toggleSection = useCallback((name: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const getInline = useCallback(
    (prop: string) => inlineStyles[prop],
    [inlineStyles],
  );

  const getComputed = useCallback((prop: string) => computed[prop], [computed]);

  const classSet = useMemo(() => new Set(classes), [classes]);

  const filteredAvailableClasses = useMemo(() => {
    if (!styleData?.availableClasses) return [];
    const s = classSearch.toLowerCase();
    return styleData.availableClasses
      .map((group) => ({
        ...group,
        classes: group.classes.filter(
          (c) => !classSet.has(c) && (!s || c.toLowerCase().includes(s)),
        ),
      }))
      .filter((g) => g.classes.length > 0);
  }, [styleData?.availableClasses, classSearch, classSet]);

  const handleAddClass = useCallback(() => {
    if (newClass.trim()) {
      onClassAdd(newClass.trim());
      setNewClass("");
    }
  }, [newClass, onClassAdd]);

  const subTabs: { key: StyleSubTab; label: string }[] = [
    { key: "design", label: "Design" },
    { key: "rules", label: "Rules" },
    { key: "classes", label: "Classes" },
  ];

  const displayValue = getInline("display");
  const computedDisplay = getComputed("display");
  const effectiveDisplay = displayValue || computedDisplay || "";

  // Helper for color fields
  const colorField = (label: string, property: string) => {
    const inline = getInline(property);
    const comp = getComputed(property);
    const computedHex = comp?.startsWith("rgb") ? rgbToHex(comp) : (comp ?? "");
    const hasColor = !isTransparentOrNone(inline ?? comp);
    return (
      <div className="studio-design-field">
        <label className="studio-design-label">{label}</label>
        <DebouncedColorInput
          value={inline}
          computedHex={computedHex}
          hasColor={hasColor}
          onChange={(v) => onStyleChange(property, v)}
          onRemove={() => onStyleRemove(property)}
        />
      </div>
    );
  };

  return (
    <div>
      {/* Sub-tab bar */}
      <div className="studio-style-subtabs">
        {subTabs.map((t) => (
          <button
            key={t.key}
            className={`studio-style-subtab ${subTab === t.key ? "active" : ""}`}
            onClick={() => setSubTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Design tab ─────────────────────────────────────────── */}
      {subTab === "design" && (
        <div className="studio-inspector-section studio-design-panel">
          {/* Typography */}
          <SectionHeader
            label="Typography"
            expanded={expandedSections.has("Typography")}
            onToggle={() => toggleSection("Typography")}
          />
          {expandedSections.has("Typography") && (
            <div className="studio-design-section-body">
              <div className="studio-design-field">
                <label className="studio-design-label">Family</label>
                <StyleInput
                  value={getInline("font-family")}
                  computed={getComputed("font-family")}
                  onChange={(v) => onStyleChange("font-family", v)}
                  onRemove={() => onStyleRemove("font-family")}
                />
              </div>
              <div className="studio-design-row-2">
                <div className="studio-design-field">
                  <label className="studio-design-label">Size</label>
                  <StyleInput
                    value={getInline("font-size")}
                    computed={getComputed("font-size")}
                    onChange={(v) => onStyleChange("font-size", v)}
                    onRemove={() => onStyleRemove("font-size")}
                    units={["px", "rem", "em", "%"]}
                  />
                </div>
                <div className="studio-design-field">
                  <label className="studio-design-label">Weight</label>
                  <SelectInput
                    value={getInline("font-weight")}
                    computed={
                      FONT_WEIGHTS.find(
                        (w) => w.value === getComputed("font-weight"),
                      )?.label ?? getComputed("font-weight")
                    }
                    options={FONT_WEIGHTS.map((w) => w.value)}
                    onChange={(v) => onStyleChange("font-weight", v)}
                    onRemove={() => onStyleRemove("font-weight")}
                  />
                </div>
              </div>
              <div className="studio-design-row-2">
                <div className="studio-design-field">
                  <label className="studio-design-label">Style</label>
                  <SelectInput
                    value={getInline("font-style")}
                    computed={getComputed("font-style")}
                    options={FONT_STYLE_OPTIONS}
                    onChange={(v) => onStyleChange("font-style", v)}
                    onRemove={() => onStyleRemove("font-style")}
                  />
                </div>
                {colorField("Color", "color")}
              </div>
              <div className="studio-design-row-2">
                <div className="studio-design-field">
                  <label className="studio-design-label">Line Height</label>
                  <StyleInput
                    value={getInline("line-height")}
                    computed={getComputed("line-height")}
                    onChange={(v) => onStyleChange("line-height", v)}
                    onRemove={() => onStyleRemove("line-height")}
                  />
                </div>
                <div className="studio-design-field">
                  <label className="studio-design-label">Spacing</label>
                  <StyleInput
                    value={getInline("letter-spacing")}
                    computed={getComputed("letter-spacing")}
                    onChange={(v) => onStyleChange("letter-spacing", v)}
                    onRemove={() => onStyleRemove("letter-spacing")}
                    units={["px", "em"]}
                  />
                </div>
              </div>
              <div className="studio-design-row-2">
                <div className="studio-design-field">
                  <label className="studio-design-label">Align</label>
                  <div className="studio-design-toggle-group">
                    {(["left", "center", "right", "justify"] as const).map(
                      (a) => (
                        <button
                          key={a}
                          className={`studio-design-toggle ${getInline("text-align") === a ? "active" : ""}`}
                          onClick={() =>
                            getInline("text-align") === a
                              ? onStyleRemove("text-align")
                              : onStyleChange("text-align", a)
                          }
                          title={a}
                        >
                          {a === "left"
                            ? "\u2190"
                            : a === "center"
                              ? "\u2194"
                              : a === "right"
                                ? "\u2192"
                                : "\u2550"}
                        </button>
                      ),
                    )}
                  </div>
                </div>
                <div className="studio-design-field">
                  <label className="studio-design-label">Transform</label>
                  <SelectInput
                    value={getInline("text-transform")}
                    computed={getComputed("text-transform")}
                    options={TEXT_TRANSFORM_OPTIONS}
                    onChange={(v) => onStyleChange("text-transform", v)}
                    onRemove={() => onStyleRemove("text-transform")}
                  />
                </div>
              </div>
              <div className="studio-design-field">
                <label className="studio-design-label">Decoration</label>
                <SelectInput
                  value={getInline("text-decoration")}
                  computed={getComputed("text-decoration")}
                  options={TEXT_DECORATION_OPTIONS}
                  onChange={(v) => onStyleChange("text-decoration", v)}
                  onRemove={() => onStyleRemove("text-decoration")}
                />
              </div>
            </div>
          )}

          {/* Spacing */}
          <SectionHeader
            label="Spacing"
            expanded={expandedSections.has("Spacing")}
            onToggle={() => toggleSection("Spacing")}
          />
          {expandedSections.has("Spacing") && (
            <div className="studio-design-section-body">
              <div className="studio-box-model">
                <div className="studio-box-model-label">margin</div>
                <div className="studio-box-model-margin">
                  {(["top", "right", "bottom", "left"] as const).map((side) => (
                    <input
                      key={side}
                      className={`studio-box-input studio-box-${side}`}
                      value={getInline(`margin-${side}`) ?? ""}
                      placeholder={getComputed(`margin-${side}`) ?? "0"}
                      onChange={(e) =>
                        onStyleChange(`margin-${side}`, e.target.value)
                      }
                      title={`margin-${side}`}
                    />
                  ))}
                  <div className="studio-box-model-padding">
                    <div className="studio-box-model-label">padding</div>
                    {(["top", "right", "bottom", "left"] as const).map(
                      (side) => (
                        <input
                          key={side}
                          className={`studio-box-input studio-box-${side}`}
                          value={getInline(`padding-${side}`) ?? ""}
                          placeholder={getComputed(`padding-${side}`) ?? "0"}
                          onChange={(e) =>
                            onStyleChange(`padding-${side}`, e.target.value)
                          }
                          title={`padding-${side}`}
                        />
                      ),
                    )}
                    <div className="studio-box-model-content">content</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Size */}
          <SectionHeader
            label="Size"
            expanded={expandedSections.has("Size")}
            onToggle={() => toggleSection("Size")}
          />
          {expandedSections.has("Size") && (
            <div className="studio-design-section-body">
              <div className="studio-design-row-2">
                <div className="studio-design-field">
                  <label className="studio-design-label">Width</label>
                  <StyleInput
                    value={getInline("width")}
                    computed={getComputed("width")}
                    onChange={(v) => onStyleChange("width", v)}
                    onRemove={() => onStyleRemove("width")}
                    units={["px", "rem", "%", "auto"]}
                  />
                </div>
                <div className="studio-design-field">
                  <label className="studio-design-label">Height</label>
                  <StyleInput
                    value={getInline("height")}
                    computed={getComputed("height")}
                    onChange={(v) => onStyleChange("height", v)}
                    onRemove={() => onStyleRemove("height")}
                    units={["px", "rem", "%", "auto"]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Background */}
          <SectionHeader
            label="Background"
            expanded={expandedSections.has("Background")}
            onToggle={() => toggleSection("Background")}
          />
          {expandedSections.has("Background") && (
            <div className="studio-design-section-body">
              {colorField("Color", "background-color")}
            </div>
          )}

          {/* Border */}
          <SectionHeader
            label="Border"
            expanded={expandedSections.has("Border")}
            onToggle={() => toggleSection("Border")}
          />
          {expandedSections.has("Border") && (
            <div className="studio-design-section-body">
              <div className="studio-design-row-2">
                <div className="studio-design-field">
                  <label className="studio-design-label">Width</label>
                  <StyleInput
                    value={getInline("border-top-width")}
                    computed={getComputed("border-top-width")}
                    onChange={(v) => {
                      onStyleChange("border-top-width", v);
                      onStyleChange("border-right-width", v);
                      onStyleChange("border-bottom-width", v);
                      onStyleChange("border-left-width", v);
                    }}
                    onRemove={() => {
                      onStyleRemove("border-top-width");
                      onStyleRemove("border-right-width");
                      onStyleRemove("border-bottom-width");
                      onStyleRemove("border-left-width");
                    }}
                    units={["px"]}
                  />
                </div>
                <div className="studio-design-field">
                  <label className="studio-design-label">Style</label>
                  <SelectInput
                    value={getInline("border-top-style")}
                    computed={getComputed("border-top-style")}
                    options={BORDER_STYLE_OPTIONS}
                    onChange={(v) => {
                      onStyleChange("border-top-style", v);
                      onStyleChange("border-right-style", v);
                      onStyleChange("border-bottom-style", v);
                      onStyleChange("border-left-style", v);
                    }}
                    onRemove={() => {
                      onStyleRemove("border-top-style");
                      onStyleRemove("border-right-style");
                      onStyleRemove("border-bottom-style");
                      onStyleRemove("border-left-style");
                    }}
                  />
                </div>
              </div>
              <div className="studio-design-row-2">
                {colorField("Color", "border-top-color")}
                <div className="studio-design-field">
                  <label className="studio-design-label">Radius</label>
                  <StyleInput
                    value={getInline("border-top-left-radius")}
                    computed={getComputed("border-top-left-radius")}
                    onChange={(v) => {
                      onStyleChange("border-top-left-radius", v);
                      onStyleChange("border-top-right-radius", v);
                      onStyleChange("border-bottom-right-radius", v);
                      onStyleChange("border-bottom-left-radius", v);
                    }}
                    onRemove={() => {
                      onStyleRemove("border-top-left-radius");
                      onStyleRemove("border-top-right-radius");
                      onStyleRemove("border-bottom-right-radius");
                      onStyleRemove("border-bottom-left-radius");
                    }}
                    units={["px", "rem", "%"]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Layout */}
          <SectionHeader
            label="Layout"
            expanded={expandedSections.has("Layout")}
            onToggle={() => toggleSection("Layout")}
          />
          {expandedSections.has("Layout") && (
            <div className="studio-design-section-body">
              <div className="studio-design-field">
                <label className="studio-design-label">Display</label>
                <SelectInput
                  value={displayValue}
                  computed={computedDisplay}
                  options={DISPLAY_OPTIONS}
                  onChange={(v) => onStyleChange("display", v)}
                  onRemove={() => onStyleRemove("display")}
                />
              </div>
              {(effectiveDisplay === "flex" ||
                effectiveDisplay === "inline-flex") && (
                <>
                  <div className="studio-design-row-2">
                    <div className="studio-design-field">
                      <label className="studio-design-label">Direction</label>
                      <SelectInput
                        value={getInline("flex-direction")}
                        computed={getComputed("flex-direction")}
                        options={FLEX_DIRECTION_OPTIONS}
                        onChange={(v) => onStyleChange("flex-direction", v)}
                        onRemove={() => onStyleRemove("flex-direction")}
                      />
                    </div>
                    <div className="studio-design-field">
                      <label className="studio-design-label">Wrap</label>
                      <SelectInput
                        value={getInline("flex-wrap")}
                        computed={getComputed("flex-wrap")}
                        options={FLEX_WRAP_OPTIONS}
                        onChange={(v) => onStyleChange("flex-wrap", v)}
                        onRemove={() => onStyleRemove("flex-wrap")}
                      />
                    </div>
                  </div>
                  <div className="studio-design-row-2">
                    <div className="studio-design-field">
                      <label className="studio-design-label">Justify</label>
                      <SelectInput
                        value={getInline("justify-content")}
                        computed={getComputed("justify-content")}
                        options={JUSTIFY_OPTIONS}
                        onChange={(v) => onStyleChange("justify-content", v)}
                        onRemove={() => onStyleRemove("justify-content")}
                      />
                    </div>
                    <div className="studio-design-field">
                      <label className="studio-design-label">Align</label>
                      <SelectInput
                        value={getInline("align-items")}
                        computed={getComputed("align-items")}
                        options={ALIGN_OPTIONS}
                        onChange={(v) => onStyleChange("align-items", v)}
                        onRemove={() => onStyleRemove("align-items")}
                      />
                    </div>
                  </div>
                  <div className="studio-design-field">
                    <label className="studio-design-label">Gap</label>
                    <StyleInput
                      value={getInline("gap")}
                      computed={getComputed("gap")}
                      onChange={(v) => onStyleChange("gap", v)}
                      onRemove={() => onStyleRemove("gap")}
                      units={["px", "rem"]}
                    />
                  </div>
                </>
              )}
              {effectiveDisplay === "grid" && (
                <>
                  <div className="studio-design-field">
                    <label className="studio-design-label">Columns</label>
                    <StyleInput
                      value={getInline("grid-template-columns")}
                      computed={getComputed("grid-template-columns")}
                      onChange={(v) =>
                        onStyleChange("grid-template-columns", v)
                      }
                      onRemove={() => onStyleRemove("grid-template-columns")}
                    />
                  </div>
                  <div className="studio-design-field">
                    <label className="studio-design-label">Rows</label>
                    <StyleInput
                      value={getInline("grid-template-rows")}
                      computed={getComputed("grid-template-rows")}
                      onChange={(v) => onStyleChange("grid-template-rows", v)}
                      onRemove={() => onStyleRemove("grid-template-rows")}
                    />
                  </div>
                  <div className="studio-design-field">
                    <label className="studio-design-label">Gap</label>
                    <StyleInput
                      value={getInline("gap")}
                      computed={getComputed("gap")}
                      onChange={(v) => onStyleChange("gap", v)}
                      onRemove={() => onStyleRemove("gap")}
                      units={["px", "rem"]}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Effects */}
          <SectionHeader
            label="Effects"
            expanded={expandedSections.has("Effects")}
            onToggle={() => toggleSection("Effects")}
          />
          {expandedSections.has("Effects") && (
            <div className="studio-design-section-body">
              <div className="studio-design-field">
                <label className="studio-design-label">Opacity</label>
                <div className="studio-design-input-row">
                  <input
                    type="range"
                    className="studio-design-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    value={
                      getInline("opacity") ?? getComputed("opacity") ?? "1"
                    }
                    onChange={(e) => onStyleChange("opacity", e.target.value)}
                  />
                  <input
                    className="studio-inspector-value studio-design-value studio-design-value-narrow"
                    value={getInline("opacity") ?? ""}
                    placeholder={getComputed("opacity") ?? "1"}
                    onChange={(e) => onStyleChange("opacity", e.target.value)}
                  />
                  {getInline("opacity") !== undefined && (
                    <button
                      className="studio-btn studio-btn-icon studio-btn-sm studio-design-reset"
                      onClick={() => onStyleRemove("opacity")}
                      title="Reset"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
              <div className="studio-design-field">
                <label className="studio-design-label">Box Shadow</label>
                <StyleInput
                  value={getInline("box-shadow")}
                  computed={
                    getComputed("box-shadow") === "none"
                      ? undefined
                      : getComputed("box-shadow")
                  }
                  onChange={(v) => onStyleChange("box-shadow", v)}
                  onRemove={() => onStyleRemove("box-shadow")}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Rules tab ──────────────────────────────────────────── */}
      {subTab === "rules" && (
        <div className="studio-inspector-section">
          {styleData?.matchedRules && styleData.matchedRules.length > 0 ? (
            styleData.matchedRules.map((rule, i) => (
              <div key={i} className="studio-matched-rule">
                <div className="studio-matched-rule-header">
                  <span className="studio-matched-rule-selector">
                    {rule.selector}
                  </span>
                  <span className="studio-matched-rule-source">
                    {shortenSource(rule.source)}
                  </span>
                </div>
                <div className="studio-matched-rule-props">
                  {Object.entries(rule.properties).map(([prop, val]) => (
                    <div key={prop} className="studio-matched-rule-prop">
                      <span className="studio-matched-rule-prop-name">
                        {prop}
                      </span>
                      <span className="studio-matched-rule-prop-value">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="studio-inspector-empty-text">
              No matched CSS rules
            </div>
          )}
        </div>
      )}

      {/* ── Classes tab ────────────────────────────────────────── */}
      {subTab === "classes" && (
        <div className="studio-inspector-section">
          {/* Applied classes */}
          <div className="studio-style-section-title">Applied</div>
          <div className="studio-class-list">
            {classes.length > 0 ? (
              classes.map((cls) => (
                <span key={cls} className="studio-class-chip">
                  {cls}
                  <button
                    className="studio-class-chip-remove"
                    onClick={() => onClassRemove(cls)}
                  >
                    &times;
                  </button>
                </span>
              ))
            ) : (
              <div className="studio-inspector-empty-text">No classes</div>
            )}
          </div>

          {/* Add custom class */}
          <div className="studio-class-add-row" style={{ marginTop: 8 }}>
            <input
              className="studio-inspector-value"
              placeholder="Type a class name..."
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddClass();
              }}
            />
            <button
              className="studio-btn studio-btn-sm"
              onClick={handleAddClass}
              disabled={!newClass.trim()}
            >
              Add
            </button>
          </div>

          {/* Available classes from stylesheets */}
          {styleData?.availableClasses &&
            styleData.availableClasses.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div className="studio-style-section-title">
                  From Stylesheets
                </div>
                <div
                  className="studio-inspector-empty-text"
                  style={{ marginBottom: 6 }}
                >
                  Click to add, click again to remove
                </div>
                <input
                  className="studio-inspector-value"
                  placeholder="Filter classes..."
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                  style={{ marginBottom: 8 }}
                />
                <div className="studio-available-classes">
                  {filteredAvailableClasses.map((group, gi) => (
                    <div key={gi} className="studio-available-class-group">
                      <div className="studio-available-class-source">
                        {shortenSource(group.source)}
                      </div>
                      <div className="studio-available-class-list">
                        {group.classes.slice(0, 80).map((cls) => {
                          const isApplied = classSet.has(cls);
                          return (
                            <button
                              key={cls}
                              className={`studio-available-class-item ${isApplied ? "studio-available-class-applied" : ""}`}
                              onClick={() =>
                                isApplied ? onClassRemove(cls) : onClassAdd(cls)
                              }
                              title={
                                isApplied ? `Remove .${cls}` : `Add .${cls}`
                              }
                            >
                              {cls}
                            </button>
                          );
                        })}
                        {group.classes.length > 80 && (
                          <span className="studio-text-muted">
                            +{group.classes.length - 80} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};
