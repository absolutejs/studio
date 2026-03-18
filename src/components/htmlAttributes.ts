/**
 * Static registry of valid HTML attributes per element.
 * Provides getAttributesForElement(tagName) which returns global + element-specific attributes.
 */

export type AttributeType =
  | "string"
  | "number"
  | "boolean"
  | "enum"
  | "url"
  | "color"
  | "css";

export type AttributeMeta = {
  name: string;
  type: AttributeType;
  description: string;
  category: string;
  enumValues?: string[];
};

// ── Global attributes (valid on all elements) ──────────────────────────

const GLOBAL_ATTRIBUTES: AttributeMeta[] = [
  // Core
  {
    name: "id",
    type: "string",
    description: "Unique identifier",
    category: "Core",
  },
  {
    name: "class",
    type: "string",
    description: "CSS class names",
    category: "Core",
  },
  {
    name: "style",
    type: "css",
    description: "Inline CSS styles",
    category: "Core",
  },
  {
    name: "title",
    type: "string",
    description: "Advisory tooltip text",
    category: "Core",
  },
  {
    name: "lang",
    type: "string",
    description: "Language of the element",
    category: "Core",
  },
  {
    name: "dir",
    type: "enum",
    description: "Text direction",
    category: "Core",
    enumValues: ["ltr", "rtl", "auto"],
  },
  {
    name: "hidden",
    type: "boolean",
    description: "Whether the element is hidden",
    category: "Core",
  },
  {
    name: "tabindex",
    type: "number",
    description: "Tab order",
    category: "Core",
  },
  {
    name: "accesskey",
    type: "string",
    description: "Keyboard shortcut",
    category: "Core",
  },
  {
    name: "contenteditable",
    type: "enum",
    description: "Whether content is editable",
    category: "Core",
    enumValues: ["true", "false", "plaintext-only"],
  },
  {
    name: "draggable",
    type: "enum",
    description: "Whether the element is draggable",
    category: "Core",
    enumValues: ["true", "false"],
  },
  {
    name: "spellcheck",
    type: "enum",
    description: "Spell checking",
    category: "Core",
    enumValues: ["true", "false"],
  },
  {
    name: "translate",
    type: "enum",
    description: "Whether to translate",
    category: "Core",
    enumValues: ["yes", "no"],
  },
  {
    name: "enterkeyhint",
    type: "enum",
    description: "Enter key hint for virtual keyboards",
    category: "Core",
    enumValues: ["enter", "done", "go", "next", "previous", "search", "send"],
  },
  {
    name: "inputmode",
    type: "enum",
    description: "Virtual keyboard type hint",
    category: "Core",
    enumValues: [
      "none",
      "text",
      "decimal",
      "numeric",
      "tel",
      "search",
      "email",
      "url",
    ],
  },
  {
    name: "slot",
    type: "string",
    description: "Slot assignment",
    category: "Core",
  },
  {
    name: "part",
    type: "string",
    description: "Part names for CSS ::part()",
    category: "Core",
  },
  { name: "nonce", type: "string", description: "CSP nonce", category: "Core" },
  {
    name: "autofocus",
    type: "boolean",
    description: "Auto-focus on page load",
    category: "Core",
  },
  {
    name: "popover",
    type: "enum",
    description: "Popover behavior",
    category: "Core",
    enumValues: ["auto", "manual"],
  },
  {
    name: "inert",
    type: "boolean",
    description: "Makes element non-interactive",
    category: "Core",
  },

  // ARIA
  { name: "role", type: "string", description: "ARIA role", category: "ARIA" },
  {
    name: "aria-label",
    type: "string",
    description: "Accessible label",
    category: "ARIA",
  },
  {
    name: "aria-labelledby",
    type: "string",
    description: "ID of labelling element",
    category: "ARIA",
  },
  {
    name: "aria-describedby",
    type: "string",
    description: "ID of describing element",
    category: "ARIA",
  },
  {
    name: "aria-hidden",
    type: "enum",
    description: "Hidden from accessibility tree",
    category: "ARIA",
    enumValues: ["true", "false"],
  },
  {
    name: "aria-live",
    type: "enum",
    description: "Live region politeness",
    category: "ARIA",
    enumValues: ["off", "polite", "assertive"],
  },
  {
    name: "aria-expanded",
    type: "enum",
    description: "Whether expanded",
    category: "ARIA",
    enumValues: ["true", "false"],
  },
  {
    name: "aria-selected",
    type: "enum",
    description: "Whether selected",
    category: "ARIA",
    enumValues: ["true", "false"],
  },
  {
    name: "aria-checked",
    type: "enum",
    description: "Whether checked",
    category: "ARIA",
    enumValues: ["true", "false", "mixed"],
  },
  {
    name: "aria-disabled",
    type: "enum",
    description: "Whether disabled",
    category: "ARIA",
    enumValues: ["true", "false"],
  },
  {
    name: "aria-required",
    type: "enum",
    description: "Whether required",
    category: "ARIA",
    enumValues: ["true", "false"],
  },
  {
    name: "aria-invalid",
    type: "enum",
    description: "Whether invalid",
    category: "ARIA",
    enumValues: ["true", "false", "grammar", "spelling"],
  },
  {
    name: "aria-current",
    type: "enum",
    description: "Current item indicator",
    category: "ARIA",
    enumValues: ["page", "step", "location", "date", "time", "true", "false"],
  },
  {
    name: "aria-haspopup",
    type: "enum",
    description: "Has popup",
    category: "ARIA",
    enumValues: ["true", "false", "menu", "listbox", "tree", "grid", "dialog"],
  },
  {
    name: "aria-controls",
    type: "string",
    description: "ID of controlled element",
    category: "ARIA",
  },
  {
    name: "aria-owns",
    type: "string",
    description: "ID of owned element",
    category: "ARIA",
  },
  {
    name: "aria-pressed",
    type: "enum",
    description: "Toggle state",
    category: "ARIA",
    enumValues: ["true", "false", "mixed"],
  },
  {
    name: "aria-valuemin",
    type: "number",
    description: "Minimum value",
    category: "ARIA",
  },
  {
    name: "aria-valuemax",
    type: "number",
    description: "Maximum value",
    category: "ARIA",
  },
  {
    name: "aria-valuenow",
    type: "number",
    description: "Current value",
    category: "ARIA",
  },
  {
    name: "aria-valuetext",
    type: "string",
    description: "Text alternative for value",
    category: "ARIA",
  },
  {
    name: "aria-busy",
    type: "enum",
    description: "Being updated",
    category: "ARIA",
    enumValues: ["true", "false"],
  },
  {
    name: "aria-atomic",
    type: "enum",
    description: "Atomic live region",
    category: "ARIA",
    enumValues: ["true", "false"],
  },
  {
    name: "aria-relevant",
    type: "string",
    description: "What changes are relevant",
    category: "ARIA",
  },
  {
    name: "aria-placeholder",
    type: "string",
    description: "Placeholder text",
    category: "ARIA",
  },
  {
    name: "aria-roledescription",
    type: "string",
    description: "Role description",
    category: "ARIA",
  },

  // Event-related (data attributes)
  {
    name: "data-",
    type: "string",
    description: "Custom data attribute",
    category: "Data",
  },
];

// ── Per-element attributes ─────────────────────────────────────────────

const ELEMENT_ATTRIBUTES: Record<string, AttributeMeta[]> = {
  a: [
    {
      name: "href",
      type: "url",
      description: "URL of the linked resource",
      category: "Link",
    },
    {
      name: "target",
      type: "enum",
      description: "Where to open the link",
      category: "Link",
      enumValues: ["_self", "_blank", "_parent", "_top"],
    },
    {
      name: "rel",
      type: "string",
      description: "Relationship to linked resource",
      category: "Link",
    },
    {
      name: "download",
      type: "string",
      description: "Download filename",
      category: "Link",
    },
    {
      name: "hreflang",
      type: "string",
      description: "Language of linked resource",
      category: "Link",
    },
    {
      name: "type",
      type: "string",
      description: "MIME type of linked resource",
      category: "Link",
    },
    {
      name: "referrerpolicy",
      type: "enum",
      description: "Referrer policy",
      category: "Link",
      enumValues: [
        "no-referrer",
        "no-referrer-when-downgrade",
        "origin",
        "origin-when-cross-origin",
        "same-origin",
        "strict-origin",
        "strict-origin-when-cross-origin",
        "unsafe-url",
      ],
    },
    {
      name: "ping",
      type: "string",
      description: "URLs to ping on click",
      category: "Link",
    },
  ],
  img: [
    { name: "src", type: "url", description: "Image URL", category: "Media" },
    {
      name: "alt",
      type: "string",
      description: "Alternative text",
      category: "Media",
    },
    {
      name: "width",
      type: "number",
      description: "Image width",
      category: "Media",
    },
    {
      name: "height",
      type: "number",
      description: "Image height",
      category: "Media",
    },
    {
      name: "loading",
      type: "enum",
      description: "Loading strategy",
      category: "Media",
      enumValues: ["lazy", "eager"],
    },
    {
      name: "decoding",
      type: "enum",
      description: "Decoding hint",
      category: "Media",
      enumValues: ["sync", "async", "auto"],
    },
    {
      name: "crossorigin",
      type: "enum",
      description: "CORS setting",
      category: "Media",
      enumValues: ["anonymous", "use-credentials"],
    },
    {
      name: "srcset",
      type: "string",
      description: "Responsive image sources",
      category: "Media",
    },
    {
      name: "sizes",
      type: "string",
      description: "Source sizes",
      category: "Media",
    },
    {
      name: "fetchpriority",
      type: "enum",
      description: "Fetch priority",
      category: "Media",
      enumValues: ["high", "low", "auto"],
    },
    {
      name: "referrerpolicy",
      type: "enum",
      description: "Referrer policy",
      category: "Media",
      enumValues: [
        "no-referrer",
        "no-referrer-when-downgrade",
        "origin",
        "origin-when-cross-origin",
        "same-origin",
        "strict-origin",
        "strict-origin-when-cross-origin",
        "unsafe-url",
      ],
    },
    {
      name: "ismap",
      type: "boolean",
      description: "Server-side image map",
      category: "Media",
    },
    {
      name: "usemap",
      type: "string",
      description: "Client-side image map",
      category: "Media",
    },
  ],
  video: [
    { name: "src", type: "url", description: "Video URL", category: "Media" },
    {
      name: "poster",
      type: "url",
      description: "Poster image URL",
      category: "Media",
    },
    {
      name: "width",
      type: "number",
      description: "Video width",
      category: "Media",
    },
    {
      name: "height",
      type: "number",
      description: "Video height",
      category: "Media",
    },
    {
      name: "autoplay",
      type: "boolean",
      description: "Auto-play on load",
      category: "Media",
    },
    {
      name: "controls",
      type: "boolean",
      description: "Show playback controls",
      category: "Media",
    },
    {
      name: "loop",
      type: "boolean",
      description: "Loop playback",
      category: "Media",
    },
    {
      name: "muted",
      type: "boolean",
      description: "Muted by default",
      category: "Media",
    },
    {
      name: "playsinline",
      type: "boolean",
      description: "Play inline on mobile",
      category: "Media",
    },
    {
      name: "preload",
      type: "enum",
      description: "Preload hint",
      category: "Media",
      enumValues: ["none", "metadata", "auto"],
    },
    {
      name: "crossorigin",
      type: "enum",
      description: "CORS setting",
      category: "Media",
      enumValues: ["anonymous", "use-credentials"],
    },
  ],
  audio: [
    { name: "src", type: "url", description: "Audio URL", category: "Media" },
    {
      name: "autoplay",
      type: "boolean",
      description: "Auto-play on load",
      category: "Media",
    },
    {
      name: "controls",
      type: "boolean",
      description: "Show playback controls",
      category: "Media",
    },
    {
      name: "loop",
      type: "boolean",
      description: "Loop playback",
      category: "Media",
    },
    {
      name: "muted",
      type: "boolean",
      description: "Muted by default",
      category: "Media",
    },
    {
      name: "preload",
      type: "enum",
      description: "Preload hint",
      category: "Media",
      enumValues: ["none", "metadata", "auto"],
    },
    {
      name: "crossorigin",
      type: "enum",
      description: "CORS setting",
      category: "Media",
      enumValues: ["anonymous", "use-credentials"],
    },
  ],
  source: [
    { name: "src", type: "url", description: "Media URL", category: "Media" },
    {
      name: "type",
      type: "string",
      description: "MIME type",
      category: "Media",
    },
    {
      name: "srcset",
      type: "string",
      description: "Image sources (in <picture>)",
      category: "Media",
    },
    {
      name: "sizes",
      type: "string",
      description: "Source sizes (in <picture>)",
      category: "Media",
    },
    {
      name: "media",
      type: "string",
      description: "Media query",
      category: "Media",
    },
    {
      name: "width",
      type: "number",
      description: "Width (in <picture>)",
      category: "Media",
    },
    {
      name: "height",
      type: "number",
      description: "Height (in <picture>)",
      category: "Media",
    },
  ],
  input: [
    {
      name: "type",
      type: "enum",
      description: "Input type",
      category: "Form",
      enumValues: [
        "text",
        "password",
        "email",
        "number",
        "tel",
        "url",
        "search",
        "date",
        "time",
        "datetime-local",
        "month",
        "week",
        "color",
        "range",
        "file",
        "checkbox",
        "radio",
        "submit",
        "reset",
        "button",
        "hidden",
        "image",
      ],
    },
    {
      name: "name",
      type: "string",
      description: "Form control name",
      category: "Form",
    },
    {
      name: "value",
      type: "string",
      description: "Current value",
      category: "Form",
    },
    {
      name: "placeholder",
      type: "string",
      description: "Placeholder text",
      category: "Form",
    },
    {
      name: "required",
      type: "boolean",
      description: "Required field",
      category: "Form",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disabled state",
      category: "Form",
    },
    {
      name: "readonly",
      type: "boolean",
      description: "Read-only",
      category: "Form",
    },
    {
      name: "checked",
      type: "boolean",
      description: "Checked state (checkbox/radio)",
      category: "Form",
    },
    {
      name: "maxlength",
      type: "number",
      description: "Maximum length",
      category: "Form",
    },
    {
      name: "minlength",
      type: "number",
      description: "Minimum length",
      category: "Form",
    },
    {
      name: "min",
      type: "string",
      description: "Minimum value",
      category: "Form",
    },
    {
      name: "max",
      type: "string",
      description: "Maximum value",
      category: "Form",
    },
    {
      name: "step",
      type: "string",
      description: "Step increment",
      category: "Form",
    },
    {
      name: "pattern",
      type: "string",
      description: "Validation pattern",
      category: "Form",
    },
    {
      name: "autocomplete",
      type: "string",
      description: "Autocomplete hint",
      category: "Form",
    },
    {
      name: "multiple",
      type: "boolean",
      description: "Allow multiple values",
      category: "Form",
    },
    {
      name: "accept",
      type: "string",
      description: "Accepted file types",
      category: "Form",
    },
    {
      name: "size",
      type: "number",
      description: "Visible width",
      category: "Form",
    },
    {
      name: "list",
      type: "string",
      description: "Datalist ID",
      category: "Form",
    },
    {
      name: "form",
      type: "string",
      description: "Associated form ID",
      category: "Form",
    },
    {
      name: "formaction",
      type: "url",
      description: "Form submission URL",
      category: "Form",
    },
    {
      name: "formmethod",
      type: "enum",
      description: "Form method",
      category: "Form",
      enumValues: ["get", "post"],
    },
    {
      name: "formnovalidate",
      type: "boolean",
      description: "Skip validation on submit",
      category: "Form",
    },
    {
      name: "formtarget",
      type: "enum",
      description: "Form target",
      category: "Form",
      enumValues: ["_self", "_blank", "_parent", "_top"],
    },
    {
      name: "capture",
      type: "enum",
      description: "Media capture",
      category: "Form",
      enumValues: ["user", "environment"],
    },
  ],
  textarea: [
    {
      name: "name",
      type: "string",
      description: "Form control name",
      category: "Form",
    },
    {
      name: "placeholder",
      type: "string",
      description: "Placeholder text",
      category: "Form",
    },
    {
      name: "required",
      type: "boolean",
      description: "Required field",
      category: "Form",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disabled state",
      category: "Form",
    },
    {
      name: "readonly",
      type: "boolean",
      description: "Read-only",
      category: "Form",
    },
    {
      name: "rows",
      type: "number",
      description: "Visible rows",
      category: "Form",
    },
    {
      name: "cols",
      type: "number",
      description: "Visible columns",
      category: "Form",
    },
    {
      name: "maxlength",
      type: "number",
      description: "Maximum length",
      category: "Form",
    },
    {
      name: "minlength",
      type: "number",
      description: "Minimum length",
      category: "Form",
    },
    {
      name: "wrap",
      type: "enum",
      description: "Text wrapping",
      category: "Form",
      enumValues: ["hard", "soft", "off"],
    },
    {
      name: "autocomplete",
      type: "string",
      description: "Autocomplete hint",
      category: "Form",
    },
    {
      name: "form",
      type: "string",
      description: "Associated form ID",
      category: "Form",
    },
  ],
  select: [
    {
      name: "name",
      type: "string",
      description: "Form control name",
      category: "Form",
    },
    {
      name: "required",
      type: "boolean",
      description: "Required field",
      category: "Form",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disabled state",
      category: "Form",
    },
    {
      name: "multiple",
      type: "boolean",
      description: "Allow multiple selections",
      category: "Form",
    },
    {
      name: "size",
      type: "number",
      description: "Visible options",
      category: "Form",
    },
    {
      name: "form",
      type: "string",
      description: "Associated form ID",
      category: "Form",
    },
    {
      name: "autocomplete",
      type: "string",
      description: "Autocomplete hint",
      category: "Form",
    },
  ],
  option: [
    {
      name: "value",
      type: "string",
      description: "Option value",
      category: "Form",
    },
    {
      name: "selected",
      type: "boolean",
      description: "Pre-selected",
      category: "Form",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disabled state",
      category: "Form",
    },
    {
      name: "label",
      type: "string",
      description: "Option label",
      category: "Form",
    },
  ],
  optgroup: [
    {
      name: "label",
      type: "string",
      description: "Group label",
      category: "Form",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disabled state",
      category: "Form",
    },
  ],
  button: [
    {
      name: "type",
      type: "enum",
      description: "Button type",
      category: "Form",
      enumValues: ["submit", "reset", "button"],
    },
    {
      name: "name",
      type: "string",
      description: "Form control name",
      category: "Form",
    },
    {
      name: "value",
      type: "string",
      description: "Button value",
      category: "Form",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disabled state",
      category: "Form",
    },
    {
      name: "form",
      type: "string",
      description: "Associated form ID",
      category: "Form",
    },
    {
      name: "formaction",
      type: "url",
      description: "Form submission URL",
      category: "Form",
    },
    {
      name: "formmethod",
      type: "enum",
      description: "Form method",
      category: "Form",
      enumValues: ["get", "post"],
    },
    {
      name: "formnovalidate",
      type: "boolean",
      description: "Skip validation",
      category: "Form",
    },
    {
      name: "formtarget",
      type: "enum",
      description: "Form target",
      category: "Form",
      enumValues: ["_self", "_blank", "_parent", "_top"],
    },
    {
      name: "popovertarget",
      type: "string",
      description: "Popover target ID",
      category: "Form",
    },
    {
      name: "popovertargetaction",
      type: "enum",
      description: "Popover action",
      category: "Form",
      enumValues: ["toggle", "show", "hide"],
    },
  ],
  form: [
    {
      name: "action",
      type: "url",
      description: "Form submission URL",
      category: "Form",
    },
    {
      name: "method",
      type: "enum",
      description: "HTTP method",
      category: "Form",
      enumValues: ["get", "post", "dialog"],
    },
    {
      name: "enctype",
      type: "enum",
      description: "Encoding type",
      category: "Form",
      enumValues: [
        "application/x-www-form-urlencoded",
        "multipart/form-data",
        "text/plain",
      ],
    },
    {
      name: "target",
      type: "enum",
      description: "Submission target",
      category: "Form",
      enumValues: ["_self", "_blank", "_parent", "_top"],
    },
    {
      name: "autocomplete",
      type: "enum",
      description: "Autocomplete",
      category: "Form",
      enumValues: ["on", "off"],
    },
    {
      name: "novalidate",
      type: "boolean",
      description: "Skip validation",
      category: "Form",
    },
    {
      name: "name",
      type: "string",
      description: "Form name",
      category: "Form",
    },
    {
      name: "rel",
      type: "string",
      description: "Relationship",
      category: "Form",
    },
    {
      name: "accept-charset",
      type: "string",
      description: "Character encodings",
      category: "Form",
    },
  ],
  label: [
    {
      name: "for",
      type: "string",
      description: "Associated control ID",
      category: "Form",
    },
  ],
  fieldset: [
    {
      name: "disabled",
      type: "boolean",
      description: "Disable all controls",
      category: "Form",
    },
    {
      name: "form",
      type: "string",
      description: "Associated form ID",
      category: "Form",
    },
    {
      name: "name",
      type: "string",
      description: "Fieldset name",
      category: "Form",
    },
  ],
  output: [
    {
      name: "for",
      type: "string",
      description: "Related control IDs",
      category: "Form",
    },
    {
      name: "form",
      type: "string",
      description: "Associated form ID",
      category: "Form",
    },
    {
      name: "name",
      type: "string",
      description: "Output name",
      category: "Form",
    },
  ],
  progress: [
    {
      name: "value",
      type: "number",
      description: "Current value",
      category: "Form",
    },
    {
      name: "max",
      type: "number",
      description: "Maximum value",
      category: "Form",
    },
  ],
  meter: [
    {
      name: "value",
      type: "number",
      description: "Current value",
      category: "Form",
    },
    {
      name: "min",
      type: "number",
      description: "Minimum value",
      category: "Form",
    },
    {
      name: "max",
      type: "number",
      description: "Maximum value",
      category: "Form",
    },
    {
      name: "low",
      type: "number",
      description: "Low threshold",
      category: "Form",
    },
    {
      name: "high",
      type: "number",
      description: "High threshold",
      category: "Form",
    },
    {
      name: "optimum",
      type: "number",
      description: "Optimum value",
      category: "Form",
    },
  ],
  table: [
    {
      name: "border",
      type: "number",
      description: "Border width (deprecated)",
      category: "Table",
    },
  ],
  td: [
    {
      name: "colspan",
      type: "number",
      description: "Column span",
      category: "Table",
    },
    {
      name: "rowspan",
      type: "number",
      description: "Row span",
      category: "Table",
    },
    {
      name: "headers",
      type: "string",
      description: "Associated header IDs",
      category: "Table",
    },
  ],
  th: [
    {
      name: "colspan",
      type: "number",
      description: "Column span",
      category: "Table",
    },
    {
      name: "rowspan",
      type: "number",
      description: "Row span",
      category: "Table",
    },
    {
      name: "headers",
      type: "string",
      description: "Associated header IDs",
      category: "Table",
    },
    {
      name: "scope",
      type: "enum",
      description: "Header scope",
      category: "Table",
      enumValues: ["row", "col", "rowgroup", "colgroup"],
    },
    {
      name: "abbr",
      type: "string",
      description: "Abbreviated header",
      category: "Table",
    },
  ],
  col: [
    {
      name: "span",
      type: "number",
      description: "Column span",
      category: "Table",
    },
  ],
  colgroup: [
    {
      name: "span",
      type: "number",
      description: "Column span",
      category: "Table",
    },
  ],
  iframe: [
    { name: "src", type: "url", description: "Page URL", category: "Embed" },
    {
      name: "srcdoc",
      type: "string",
      description: "Inline HTML content",
      category: "Embed",
    },
    {
      name: "name",
      type: "string",
      description: "Frame name",
      category: "Embed",
    },
    {
      name: "width",
      type: "number",
      description: "Frame width",
      category: "Embed",
    },
    {
      name: "height",
      type: "number",
      description: "Frame height",
      category: "Embed",
    },
    {
      name: "sandbox",
      type: "string",
      description: "Sandbox restrictions",
      category: "Embed",
    },
    {
      name: "allow",
      type: "string",
      description: "Permissions policy",
      category: "Embed",
    },
    {
      name: "loading",
      type: "enum",
      description: "Loading strategy",
      category: "Embed",
      enumValues: ["lazy", "eager"],
    },
    {
      name: "referrerpolicy",
      type: "enum",
      description: "Referrer policy",
      category: "Embed",
      enumValues: [
        "no-referrer",
        "no-referrer-when-downgrade",
        "origin",
        "origin-when-cross-origin",
        "same-origin",
        "strict-origin",
        "strict-origin-when-cross-origin",
        "unsafe-url",
      ],
    },
  ],
  canvas: [
    {
      name: "width",
      type: "number",
      description: "Canvas width",
      category: "Media",
    },
    {
      name: "height",
      type: "number",
      description: "Canvas height",
      category: "Media",
    },
  ],
  link: [
    {
      name: "href",
      type: "url",
      description: "Resource URL",
      category: "Meta",
    },
    {
      name: "rel",
      type: "string",
      description: "Relationship",
      category: "Meta",
    },
    {
      name: "type",
      type: "string",
      description: "MIME type",
      category: "Meta",
    },
    {
      name: "media",
      type: "string",
      description: "Media query",
      category: "Meta",
    },
    {
      name: "crossorigin",
      type: "enum",
      description: "CORS setting",
      category: "Meta",
      enumValues: ["anonymous", "use-credentials"],
    },
    {
      name: "integrity",
      type: "string",
      description: "Subresource integrity",
      category: "Meta",
    },
    {
      name: "as",
      type: "string",
      description: "Preload resource type",
      category: "Meta",
    },
    {
      name: "sizes",
      type: "string",
      description: "Icon sizes",
      category: "Meta",
    },
  ],
  script: [
    { name: "src", type: "url", description: "Script URL", category: "Script" },
    {
      name: "type",
      type: "string",
      description: "Script type",
      category: "Script",
    },
    {
      name: "async",
      type: "boolean",
      description: "Async loading",
      category: "Script",
    },
    {
      name: "defer",
      type: "boolean",
      description: "Deferred execution",
      category: "Script",
    },
    {
      name: "crossorigin",
      type: "enum",
      description: "CORS setting",
      category: "Script",
      enumValues: ["anonymous", "use-credentials"],
    },
    {
      name: "integrity",
      type: "string",
      description: "Subresource integrity",
      category: "Script",
    },
    {
      name: "nomodule",
      type: "boolean",
      description: "Skip for module-capable browsers",
      category: "Script",
    },
  ],
  meta: [
    {
      name: "name",
      type: "string",
      description: "Metadata name",
      category: "Meta",
    },
    {
      name: "content",
      type: "string",
      description: "Metadata value",
      category: "Meta",
    },
    {
      name: "charset",
      type: "string",
      description: "Character encoding",
      category: "Meta",
    },
    {
      name: "http-equiv",
      type: "string",
      description: "HTTP header equivalent",
      category: "Meta",
    },
  ],
  details: [
    {
      name: "open",
      type: "boolean",
      description: "Whether expanded",
      category: "Interactive",
    },
    {
      name: "name",
      type: "string",
      description: "Exclusive accordion group",
      category: "Interactive",
    },
  ],
  dialog: [
    {
      name: "open",
      type: "boolean",
      description: "Whether visible",
      category: "Interactive",
    },
  ],
  ol: [
    {
      name: "start",
      type: "number",
      description: "Starting number",
      category: "List",
    },
    {
      name: "reversed",
      type: "boolean",
      description: "Reversed order",
      category: "List",
    },
    {
      name: "type",
      type: "enum",
      description: "Marker type",
      category: "List",
      enumValues: ["1", "a", "A", "i", "I"],
    },
  ],
  li: [
    {
      name: "value",
      type: "number",
      description: "List item value",
      category: "List",
    },
  ],
  blockquote: [
    { name: "cite", type: "url", description: "Source URL", category: "Text" },
  ],
  q: [
    { name: "cite", type: "url", description: "Source URL", category: "Text" },
  ],
  time: [
    {
      name: "datetime",
      type: "string",
      description: "Machine-readable date/time",
      category: "Text",
    },
  ],
  data: [
    {
      name: "value",
      type: "string",
      description: "Machine-readable value",
      category: "Text",
    },
  ],
  abbr: [
    {
      name: "title",
      type: "string",
      description: "Full expansion",
      category: "Text",
    },
  ],
  map: [
    {
      name: "name",
      type: "string",
      description: "Map name",
      category: "Media",
    },
  ],
  area: [
    { name: "href", type: "url", description: "Link URL", category: "Media" },
    {
      name: "alt",
      type: "string",
      description: "Alternative text",
      category: "Media",
    },
    {
      name: "shape",
      type: "enum",
      description: "Shape",
      category: "Media",
      enumValues: ["rect", "circle", "poly", "default"],
    },
    {
      name: "coords",
      type: "string",
      description: "Shape coordinates",
      category: "Media",
    },
    {
      name: "target",
      type: "enum",
      description: "Link target",
      category: "Media",
      enumValues: ["_self", "_blank", "_parent", "_top"],
    },
    {
      name: "rel",
      type: "string",
      description: "Relationship",
      category: "Media",
    },
    {
      name: "download",
      type: "string",
      description: "Download filename",
      category: "Media",
    },
  ],
  track: [
    { name: "src", type: "url", description: "Track URL", category: "Media" },
    {
      name: "kind",
      type: "enum",
      description: "Track kind",
      category: "Media",
      enumValues: [
        "subtitles",
        "captions",
        "descriptions",
        "chapters",
        "metadata",
      ],
    },
    {
      name: "srclang",
      type: "string",
      description: "Track language",
      category: "Media",
    },
    {
      name: "label",
      type: "string",
      description: "Track label",
      category: "Media",
    },
    {
      name: "default",
      type: "boolean",
      description: "Default track",
      category: "Media",
    },
  ],
  object: [
    {
      name: "data",
      type: "url",
      description: "Resource URL",
      category: "Embed",
    },
    {
      name: "type",
      type: "string",
      description: "MIME type",
      category: "Embed",
    },
    {
      name: "name",
      type: "string",
      description: "Object name",
      category: "Embed",
    },
    { name: "width", type: "number", description: "Width", category: "Embed" },
    {
      name: "height",
      type: "number",
      description: "Height",
      category: "Embed",
    },
    {
      name: "form",
      type: "string",
      description: "Associated form ID",
      category: "Embed",
    },
  ],
  embed: [
    {
      name: "src",
      type: "url",
      description: "Resource URL",
      category: "Embed",
    },
    {
      name: "type",
      type: "string",
      description: "MIME type",
      category: "Embed",
    },
    { name: "width", type: "number", description: "Width", category: "Embed" },
    {
      name: "height",
      type: "number",
      description: "Height",
      category: "Embed",
    },
  ],
};

/**
 * Returns all valid attributes for a given HTML element tag.
 * Merges global attributes with element-specific ones.
 * Excludes attributes already present on the element (pass existing keys to filter).
 */
export function getAttributesForElement(
  tagName: string,
  existingAttributes?: Set<string>,
): { global: AttributeMeta[]; specific: AttributeMeta[] } {
  const tag = tagName.toLowerCase();
  const existing = existingAttributes ?? new Set<string>();

  const global = GLOBAL_ATTRIBUTES.filter((a) => !existing.has(a.name));
  const specific = (ELEMENT_ATTRIBUTES[tag] ?? []).filter(
    (a) => !existing.has(a.name),
  );

  return { global, specific };
}

/**
 * Get all attribute categories present for a tag.
 */
export function getAttributeCategories(tagName: string): string[] {
  const tag = tagName.toLowerCase();
  const categories = new Set<string>();

  for (const attr of GLOBAL_ATTRIBUTES) {
    categories.add(attr.category);
  }
  for (const attr of ELEMENT_ATTRIBUTES[tag] ?? []) {
    categories.add(attr.category);
  }

  return Array.from(categories);
}
