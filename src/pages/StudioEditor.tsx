import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { MonacoEditor } from "../components/MonacoEditor";
import { ElementPanel } from "../components/ElementPanel";
import { StudioHead } from "../components/StudioHead";
import { client } from "../client";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

type StudioEditorProps = {
  devServerUrl?: string;
  cssPath?: string;
  initialFrameworks?: FrameworkInfo;
};

type PageInfo = {
  name: string;
  route: string;
  framework: string;
  file?: string;
};

type FrameworkInfo = {
  configured: { framework: string; directory: string }[];
  available: string[];
};

type SelectedElement = {
  tagName: string;
  id: string;
  className: string;
  textContent: string;
  attributes: Record<string, string>;
};

type ScriptInfo = {
  name: string;
  command: string;
  category: string;
};

type ComponentTreeNode = {
  name: string;
  path: string;
  children?: ComponentTreeNode[];
};

type LayoutMode = "preview" | "source" | "split";

type EditorTab = {
  path: string;
  label: string;
  content: string;
  framework?: string;
};

interface ElementInfo {
  tag: string;
  description: string;
}

const ELEMENT_CATEGORIES: Record<string, ElementInfo[]> = {
  "Content sectioning": [
    {
      tag: "div",
      description:
        "The generic container for flow content. It has no effect on the content or layout until styled using CSS.",
    },
    {
      tag: "section",
      description: "Represents a generic standalone section of a document.",
    },
    {
      tag: "article",
      description:
        "Represents a self-contained composition in a document, page, application, or site, intended to be independently distributable or reusable.",
    },
    {
      tag: "aside",
      description:
        "Represents a portion of a document whose content is only indirectly related to the document's main content.",
    },
    {
      tag: "header",
      description:
        "Represents introductory content, typically a group of introductory or navigational aids.",
    },
    {
      tag: "footer",
      description:
        "Represents a footer for its nearest ancestor sectioning content or sectioning root element.",
    },
    {
      tag: "main",
      description: "Represents the dominant content of the body of a document.",
    },
    {
      tag: "nav",
      description:
        "Represents a section of a page whose purpose is to provide navigation links.",
    },
    { tag: "h1", description: "Represents the highest section level heading." },
    { tag: "h2", description: "Represents the second level section heading." },
    { tag: "h3", description: "Represents the third level section heading." },
    { tag: "h4", description: "Represents the fourth level section heading." },
    { tag: "h5", description: "Represents the fifth level section heading." },
    {
      tag: "h6",
      description: "Represents the sixth and lowest section level heading.",
    },
    {
      tag: "hgroup",
      description:
        "Represents a heading grouped with any secondary content, such as subheadings, an alternative title, or a tagline.",
    },
    {
      tag: "address",
      description:
        "Indicates that the enclosed HTML provides contact information for a person or people, or for an organization.",
    },
    {
      tag: "search",
      description:
        "Represents a part that contains a set of form controls or other content related to performing a search or filtering operation.",
    },
  ],
  "Text content": [
    { tag: "p", description: "Represents a paragraph." },
    {
      tag: "span",
      description:
        "A generic inline container for phrasing content, which does not inherently represent anything.",
    },
    {
      tag: "a",
      description:
        "Together with its href attribute, creates a hyperlink to web pages, files, email addresses, locations within the current page, or anything else a URL can address.",
    },
    {
      tag: "strong",
      description:
        "Indicates that its contents have strong importance, seriousness, or urgency.",
    },
    { tag: "em", description: "Marks text that has stress emphasis." },
    {
      tag: "b",
      description:
        "Used to draw the reader's attention to the element's contents, which are not otherwise granted special importance.",
    },
    {
      tag: "i",
      description:
        "Represents a range of text that is set off from the normal text for some reason, such as idiomatic text, technical terms, and taxonomical designations.",
    },
    {
      tag: "u",
      description:
        "Represents a span of inline text which should be rendered in a way that indicates a non-textual annotation.",
    },
    {
      tag: "s",
      description:
        "Renders text with a strikethrough. Use to represent things that are no longer relevant or no longer accurate.",
    },
    {
      tag: "small",
      description:
        "Represents side-comments and small print, like copyright and legal text.",
    },
    {
      tag: "mark",
      description:
        "Represents text which is marked or highlighted for reference or notation purposes.",
    },
    {
      tag: "br",
      description: "Produces a line break in text (carriage-return).",
    },
    {
      tag: "hr",
      description:
        "Represents a thematic break between paragraph-level elements.",
    },
    {
      tag: "blockquote",
      description: "Indicates that the enclosed text is an extended quotation.",
    },
    {
      tag: "q",
      description:
        "Indicates that the enclosed text is a short inline quotation.",
    },
    {
      tag: "pre",
      description:
        "Represents preformatted text which is to be presented exactly as written in the HTML file.",
    },
    {
      tag: "code",
      description:
        "Displays its contents styled in a fashion intended to indicate that the text is a short fragment of computer code.",
    },
    {
      tag: "kbd",
      description:
        "Represents a span of inline text denoting textual user input from a keyboard, voice input, or any other text entry device.",
    },
    {
      tag: "samp",
      description:
        "Used to enclose inline text which represents sample output from a computer program.",
    },
    {
      tag: "var",
      description:
        "Represents the name of a variable in a mathematical expression or a programming context.",
    },
    { tag: "abbr", description: "Represents an abbreviation or acronym." },
    {
      tag: "cite",
      description: "Used to mark up the title of a creative work.",
    },
    {
      tag: "dfn",
      description:
        "Used to indicate the term being defined within the context of a definition phrase or sentence.",
    },
    {
      tag: "sub",
      description:
        "Specifies inline text which should be displayed as subscript.",
    },
    {
      tag: "sup",
      description:
        "Specifies inline text which is to be displayed as superscript.",
    },
    { tag: "time", description: "Represents a specific period in time." },
    {
      tag: "data",
      description:
        "Links a given piece of content with a machine-readable translation.",
    },
    {
      tag: "ruby",
      description:
        "Represents small annotations rendered above, below, or next to base text, usually used for showing pronunciation of East Asian characters.",
    },
    {
      tag: "rt",
      description: "Specifies the ruby text component of a ruby annotation.",
    },
    {
      tag: "rp",
      description:
        "Used to provide fall-back parentheses for browsers that do not support ruby annotations.",
    },
    {
      tag: "bdi",
      description:
        "Tells the browser's bidirectional algorithm to treat the text it contains in isolation from its surrounding text.",
    },
    {
      tag: "bdo",
      description:
        "Overrides the current directionality of text, so that the text within is rendered in a different direction.",
    },
    {
      tag: "wbr",
      description:
        "Represents a word break opportunity — a position within text where the browser may optionally break a line.",
    },
    {
      tag: "figure",
      description:
        "Represents self-contained content, potentially with an optional caption specified using the figcaption element.",
    },
    {
      tag: "figcaption",
      description:
        "Represents a caption or legend describing the rest of the contents of its parent figure element.",
    },
    {
      tag: "ul",
      description:
        "Represents an unordered list of items, typically rendered as a bulleted list.",
    },
    {
      tag: "ol",
      description:
        "Represents an ordered list of items — typically rendered as a numbered list.",
    },
    {
      tag: "li",
      description:
        "Represents an item in a list. It must be contained in an ordered list, an unordered list, or a menu.",
    },
    {
      tag: "dl",
      description:
        "Represents a description list. Common uses are to implement a glossary or to display metadata.",
    },
    {
      tag: "dt",
      description: "Specifies a term in a description or definition list.",
    },
    {
      tag: "dd",
      description:
        "Provides the description, definition, or value for the preceding term in a description list.",
    },
    {
      tag: "menu",
      description:
        "A semantic alternative to ul, representing an unordered list of items.",
    },
  ],
  Forms: [
    {
      tag: "form",
      description:
        "Represents a document section containing interactive controls for submitting information.",
    },
    {
      tag: "input",
      description:
        "Used to create interactive controls for web-based forms to accept data from the user.",
    },
    {
      tag: "textarea",
      description: "Represents a multi-line plain-text editing control.",
    },
    {
      tag: "select",
      description: "Represents a control that provides a menu of options.",
    },
    {
      tag: "option",
      description:
        "Used to define an item contained in a select, an optgroup, or a datalist element.",
    },
    {
      tag: "optgroup",
      description: "Creates a grouping of options within a select element.",
    },
    {
      tag: "button",
      description:
        "An interactive element activated by a user to perform an action, such as submitting a form or opening a dialog.",
    },
    {
      tag: "label",
      description: "Represents a caption for an item in a user interface.",
    },
    {
      tag: "fieldset",
      description:
        "Used to group several controls as well as labels within a web form.",
    },
    {
      tag: "legend",
      description:
        "Represents a caption for the content of its parent fieldset.",
    },
    {
      tag: "datalist",
      description:
        "Contains a set of option elements that represent the permissible or recommended options available to choose from within other controls.",
    },
    {
      tag: "output",
      description:
        "Container element into which a site or app can inject the results of a calculation or the outcome of a user action.",
    },
    {
      tag: "progress",
      description:
        "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
      tag: "meter",
      description:
        "Represents either a scalar value within a known range or a fractional value.",
    },
  ],
  "Table content": [
    {
      tag: "table",
      description:
        "Represents tabular data — information presented in a two-dimensional table comprised of rows and columns of cells.",
    },
    {
      tag: "thead",
      description:
        "Encapsulates a set of table rows indicating that they comprise the head of a table.",
    },
    {
      tag: "tbody",
      description:
        "Encapsulates a set of table rows indicating that they comprise the body of a table's main data.",
    },
    {
      tag: "tfoot",
      description:
        "Encapsulates a set of table rows indicating that they comprise the foot of a table.",
    },
    { tag: "tr", description: "Defines a row of cells in a table." },
    {
      tag: "th",
      description: "Defines a cell as the header of a group of table cells.",
    },
    { tag: "td", description: "Defines a cell of a table that contains data." },
    {
      tag: "caption",
      description: "Specifies the caption (or title) of a table.",
    },
    {
      tag: "colgroup",
      description: "Defines a group of columns within a table.",
    },
    {
      tag: "col",
      description:
        "Defines one or more columns in a column group represented by its parent colgroup element.",
    },
  ],
  "Image and multimedia": [
    { tag: "img", description: "Embeds an image into the document." },
    {
      tag: "video",
      description:
        "Embeds a media player which supports video playback into the document.",
    },
    { tag: "audio", description: "Used to embed sound content in documents." },
    {
      tag: "picture",
      description:
        "Contains zero or more source elements and one img element to offer alternative versions of an image for different display/device scenarios.",
    },
    {
      tag: "source",
      description:
        "Specifies multiple media resources for the picture, audio, or video element.",
    },
    {
      tag: "track",
      description:
        "Used as a child of audio and video. Lets you specify timed text tracks, for example to handle subtitles.",
    },
    {
      tag: "map",
      description:
        "Used with area elements to define an image map (a clickable link area).",
    },
    {
      tag: "area",
      description:
        "Defines an area inside an image map that has predefined clickable areas.",
    },
  ],
  "Embedded content": [
    {
      tag: "iframe",
      description:
        "Represents a nested browsing context, embedding another HTML page into the current one.",
    },
    {
      tag: "embed",
      description:
        "Embeds external content at the specified point in the document.",
    },
    {
      tag: "object",
      description:
        "Represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.",
    },
    {
      tag: "source",
      description:
        "Specifies multiple media resources for the picture, audio, or video element.",
    },
  ],
  "Interactive elements": [
    {
      tag: "details",
      description:
        "Creates a disclosure widget in which information is visible only when the widget is toggled into an open state.",
    },
    {
      tag: "summary",
      description:
        "Specifies a summary, caption, or legend for a details element's disclosure box.",
    },
    {
      tag: "dialog",
      description:
        "Represents a dialog box or other interactive component, such as a dismissible alert, inspector, or subwindow.",
    },
  ],
  Scripting: [
    {
      tag: "script",
      description:
        "Used to embed executable code or data; typically used to embed or refer to JavaScript code.",
    },
    {
      tag: "noscript",
      description:
        "Defines a section of HTML to be inserted if a script type on the page is unsupported or if scripting is turned off.",
    },
    {
      tag: "canvas",
      description:
        "Container element to use with the canvas scripting API or the WebGL API to draw graphics and animations.",
    },
  ],
  "SVG and MathML": [
    {
      tag: "svg",
      description:
        "Container defining a new coordinate system and viewport. Used as the outermost element of SVG documents or to embed SVG fragments.",
    },
    {
      tag: "math",
      description:
        "The top-level element in MathML. Every valid MathML instance must be wrapped in it.",
    },
  ],
  "Demarcating edits": [
    {
      tag: "del",
      description:
        "Represents a range of text that has been deleted from a document.",
    },
    {
      tag: "ins",
      description:
        "Represents a range of text that has been added to a document.",
    },
  ],
  "Web Components": [
    {
      tag: "slot",
      description:
        "A placeholder inside a web component that you can fill with your own markup, letting you create separate DOM trees and present them together.",
    },
    {
      tag: "template",
      description:
        "A mechanism for holding HTML that is not rendered immediately when a page is loaded but may be instantiated subsequently during runtime using JavaScript.",
    },
  ],
  "Document metadata": [
    {
      tag: "head",
      description:
        "Contains machine-readable information (metadata) about the document, like its title, scripts, and style sheets.",
    },
    {
      tag: "title",
      description:
        "Defines the document's title that is shown in a browser's title bar or a page's tab.",
    },
    {
      tag: "meta",
      description:
        "Represents metadata that cannot be represented by other HTML meta-related elements.",
    },
    {
      tag: "link",
      description:
        "Specifies relationships between the current document and an external resource. Most commonly used to link to CSS.",
    },
    {
      tag: "style",
      description:
        "Contains style information for a document or part of a document. It contains CSS.",
    },
    {
      tag: "base",
      description:
        "Specifies the base URL to use for all relative URLs in a document.",
    },
  ],
  "Sectioning root": [
    {
      tag: "body",
      description:
        "Represents the content of an HTML document. There can be only one such element in a document.",
    },
  ],
  "Main root": [
    {
      tag: "html",
      description:
        "Represents the root (top-level element) of an HTML document. All other elements must be descendants of this element.",
    },
  ],
};

// Inline SVG icons
const CursorIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M3 2l3 11 2.2-4.5L13 6.5z" />
    <line x1="8.5" y1="8.5" x2="13" y2="13" />
  </svg>
);

const PanelLeftIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
  >
    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
    <line x1="5.5" y1="2.5" x2="5.5" y2="13.5" />
  </svg>
);

const PanelRightIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
  >
    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
    <line x1="10.5" y1="2.5" x2="10.5" y2="13.5" />
  </svg>
);

const LayoutPanelsIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
  >
    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
    <line x1="5.5" y1="2.5" x2="5.5" y2="13.5" />
    <line x1="10.5" y1="2.5" x2="10.5" y2="13.5" />
  </svg>
);

const SplitIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
  >
    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
    <line x1="8" y1="2.5" x2="8" y2="13.5" />
  </svg>
);

/** Flatten single-child directory wrappers (e.g. a lone "components/" folder) */
const flattenComponentTree = (
  nodes: ComponentTreeNode[],
): ComponentTreeNode[] => {
  if (nodes.length === 1 && nodes[0]!.children) {
    return flattenComponentTree(nodes[0]!.children);
  }
  return nodes;
};

const ComponentTree = ({
  nodes,
  depth = 0,
  collapsedState,
}: {
  nodes: ComponentTreeNode[];
  depth?: number;
  collapsedState: [Set<string>, (path: string) => void];
}) => {
  const [collapsed, toggle] = collapsedState;

  return (
    <>
      {nodes.map((node) =>
        node.children ? (
          <div key={node.path}>
            <div
              className="studio-element-category studio-element-category-toggle studio-component-subfolder"
              style={{ paddingLeft: `${depth * 12}px` }}
              onClick={() => toggle(node.path)}
            >
              <span
                className={`studio-category-chevron ${collapsed.has(node.path) ? "" : "studio-category-chevron-open"}`}
              >
                &#9654;
              </span>
              <span>{node.name}</span>
            </div>
            {!collapsed.has(node.path) && (
              <ComponentTree
                nodes={node.children}
                depth={depth + 1}
                collapsedState={collapsedState}
              />
            )}
          </div>
        ) : (
          <div
            className="studio-element-item"
            draggable
            key={node.path}
            style={{ paddingLeft: `${8 + depth * 12}px` }}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", `<${node.name} />`);
            }}
          >
            &lt;{node.name} /&gt;
          </div>
        ),
      )}
    </>
  );
};

const StudioEditorInner = ({
  devServerUrl = "http://localhost:3000",
  cssPath,
  initialFrameworks,
}: StudioEditorProps) => {
  const qc = useQueryClient();

  // --- UI state ---
  const [currentPage, setCurrentPage] = useState<PageInfo | null>(null);
  const [layout, setLayout] = useState<LayoutMode>("preview");
  const [sourceContent, setSourceContent] = useState("");
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTabPath, setActiveTabPath] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] =
    useState<SelectedElement | null>(null);
  const [showScripts, setShowScripts] = useState(false);
  const [showPanels, setShowPanels] = useState(false);
  const [scriptOutput, setScriptOutput] = useState("");
  const [runningScript, setRunningScript] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [elementTooltip, setElementTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [showPages, setShowPages] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageRoute, setNewPageRoute] = useState("");
  const [newPageFramework, setNewPageFramework] = useState(
    () => initialFrameworks?.configured[0]?.framework ?? "",
  );
  const [previewPath, setPreviewPath] = useState("/");
  const [inspectMode, setInspectMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50);
  const [reorganizeDialog, setReorganizeDialog] = useState<{
    framework: string;
    currentDirectory: string;
  } | null>(null);
  const [consolidateDialog, setConsolidateDialog] = useState<{
    framework: string;
    directory: string;
  } | null>(null);
  const [cleanupDialog, setCleanupDialog] = useState<{
    framework: string;
  } | null>(null);
  const [deletingRoute, setDeletingRoute] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    () => new Set(["Custom", ...Object.keys(ELEMENT_CATEGORIES)]),
  );

  const [componentFolderCollapsed, setComponentFolderCollapsed] = useState<
    Set<string>
  >(() => new Set());
  const toggleComponentFolder = useCallback((path: string) => {
    setComponentFolderCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const scriptsDropdownRef = useRef<HTMLDivElement>(null);
  const pagesDropdownRef = useRef<HTMLDivElement>(null);
  const panelsDropdownRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) return;
      if (
        scriptsDropdownRef.current &&
        !scriptsDropdownRef.current.contains(e.target)
      ) {
        setShowScripts(false);
      }
      if (
        pagesDropdownRef.current &&
        !pagesDropdownRef.current.contains(e.target)
      ) {
        setShowPages(false);
      }
      if (
        panelsDropdownRef.current &&
        !panelsDropdownRef.current.contains(e.target)
      ) {
        setShowPanels(false);
      }
    };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, []);

  // Prevent toolbar/dropdown clicks from disrupting Monaco's clipboard
  // service. Monaco listens for mousedown on <body> and cancels pending
  // clipboard ops when focus leaves the editor. preventDefault() on
  // mousedown stops the browser from moving focus, avoiding cancellation.
  useEffect(() => {
    const el = toolbarRef.current;
    if (!el) return;
    const preventFocusSteal = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, select, textarea")) return;
      e.preventDefault();
    };
    el.addEventListener("mousedown", preventFocusSteal);
    return () => el.removeEventListener("mousedown", preventFocusSteal);
  }, []);

  // --- Queries ---
  const { data: pages = [] } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data } = await client.api.pages.get();
      return (data ?? []) as PageInfo[];
    },
  });

  const {
    data: frameworks = initialFrameworks ?? { configured: [], available: [] },
  } = useQuery({
    queryKey: ["frameworks"],
    queryFn: async () => {
      const { data } = await client.api.frameworks.get();
      return (data ?? { configured: [], available: [] }) as FrameworkInfo;
    },
    initialData: initialFrameworks,
  });

  const { data: scripts = [] } = useQuery({
    queryKey: ["scripts"],
    queryFn: async () => {
      const { data } = await client.api.scripts.get();
      return (data ?? []) as ScriptInfo[];
    },
  });

  const currentFramework = currentPage?.framework ?? "";
  const hasComponents =
    currentFramework !== "html" &&
    currentFramework !== "htmx" &&
    !!currentFramework;

  const { data: customComponents = [] } = useQuery({
    queryKey: ["components", currentFramework],
    queryFn: async () => {
      const { data } = await client.api.components.get({
        query: { framework: currentFramework },
      });
      return (data ?? []) as ComponentTreeNode[];
    },
    enabled: hasComponents,
  });

  const sourceEditorVisible = layout === "source" || layout === "split";

  const { data: sourceData } = useQuery({
    queryKey: ["source", currentPage?.file],
    queryFn: async () => {
      const { data } = await client.api.source.get({
        query: { file: currentPage!.file! },
      });
      return data as { content: string } | null;
    },
    enabled: !!currentPage?.file,
  });

  const { data: types = {} } = useQuery({
    queryKey: ["types"],
    queryFn: async () => {
      const { data } = await client.api.types.get();
      return (data ?? {}) as Record<string, string>;
    },
    enabled: sourceEditorVisible,
  });

  const { data: deps = {} } = useQuery({
    queryKey: ["deps", currentPage?.file],
    queryFn: async () => {
      const { data } = await client.api.deps.get({
        query: { file: currentPage!.file! },
      });
      return (data ?? {}) as Record<string, string>;
    },
    enabled: sourceEditorVisible && !!currentPage?.file,
  });

  // --- Mutations ---
  const createPage = useMutation({
    mutationFn: async ({
      name,
      route,
      framework,
    }: {
      name: string;
      route: string;
      framework: string;
    }) => {
      const { data } = await client.api.pages.post({ name, route, framework });
      return data as {
        file: string;
        route: string;
        needsReorganization: {
          framework: string;
          currentDirectory: string;
        } | null;
      } | null;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"] });
      qc.invalidateQueries({ queryKey: ["frameworks"] });
    },
  });

  const saveSource = useMutation({
    mutationFn: async ({
      file,
      content,
    }: {
      file: string;
      content: string;
    }) => {
      await client.api.source.put({ file, content });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async ({
      name,
      route,
      framework,
    }: {
      name: string;
      route: string;
      framework: string;
    }) => {
      const { data } = await client.api["remove-page"].post({
        name,
        route,
        framework,
      });
      return data as {
        deletedFile: string | null;
        isLastPage: boolean;
        frameworkDir: string;
        canConsolidate: { framework: string; directory: string } | null;
      } | null;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"] });
      qc.invalidateQueries({ queryKey: ["frameworks"] });
    },
  });

  const reorganizeMutation = useMutation({
    mutationFn: async (framework: string) => {
      const { data } = await client.api.reorganize.post({ framework });
      return data as { framework: string; directory: string } | null;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"] });
      qc.invalidateQueries({ queryKey: ["frameworks"] });
    },
  });

  const consolidateMutation = useMutation({
    mutationFn: async (framework: string) => {
      const { data } = await client.api.consolidate.post({ framework });
      return data as { framework: string; directory: string } | null;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"] });
      qc.invalidateQueries({ queryKey: ["frameworks"] });
    },
  });

  const cleanupMutation = useMutation({
    mutationFn: async (framework: string) => {
      const { data } = await client.api["cleanup-framework"].post({
        framework,
      });
      return data as { framework: string; removedDeps: string[] } | null;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"] });
      qc.invalidateQueries({ queryKey: ["frameworks"] });
    },
  });

  const runScript = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await client.api.scripts.run.post({ name });
      return data as { exitCode: number; stdout: string; stderr: string };
    },
  });

  // --- Sync source content from query & manage tabs ---
  useEffect(() => {
    const content = sourceData?.content ?? "";
    setSourceContent(content);

    if (currentPage?.file && content) {
      const path = currentPage.file;
      const label = path.split("/").pop() ?? path;
      setTabs((prev) => {
        const existing = prev.find((t) => t.path === path);
        if (existing) {
          return prev.map((t) => (t.path === path ? { ...t, content } : t));
        }
        return [
          ...prev,
          { path, label, content, framework: currentPage.framework },
        ];
      });
      setActiveTabPath(path);
    }
  }, [sourceData, currentPage]);

  // Auto-select first page
  useEffect(() => {
    if (pages.length > 0 && !currentPage) {
      setCurrentPage(pages[0]!);
    }
  }, [pages, currentPage]);

  // Default framework selection
  useEffect(() => {
    if (!newPageFramework && frameworks.configured.length > 0) {
      setNewPageFramework(frameworks.configured[0]!.framework);
    }
  }, [frameworks, newPageFramework]);

  // Set initial layout based on screen size
  useEffect(() => {
    const w = window.innerWidth;
    if (w >= 1200) setShowSidebar(true);
    if (w >= 1440) setLayout("split");
  }, []);

  // Sync inspect mode with iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "__studio_set_inspect_mode", enabled: inspectMode },
        "*",
      );
    }
  }, [inspectMode]);

  // Listen for element selection from iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "__studio_select") {
        setSelectedElement(e.data.element);
        setShowInspector(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && inspectMode) {
        setInspectMode(false);
      }
      if (e.key === "\\" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setLayout((prev) => (prev === "split" ? "preview" : "split"));
      }
      if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowSidebar((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inspectMode]);

  // --- Handlers ---
  const handlePageSelect = useCallback((page: PageInfo) => {
    setCurrentPage(page);
    setShowPages(false);
    setSelectedElement(null);
    setPreviewPath(page.route);
  }, []);

  const handleCreatePage = useCallback(async () => {
    const name = newPageName.trim();
    const route = newPageRoute.trim();
    if (!name || !route || !newPageFramework) return;

    // Single call handles everything: scaffold framework if needed,
    // create page file, add route to server.ts
    const result = await createPage.mutateAsync({
      name,
      route,
      framework: newPageFramework,
    });

    // Check if we need to ask about reorganization
    if (result?.needsReorganization) {
      setReorganizeDialog(result.needsReorganization);
    }

    // Navigate to the new route
    setPreviewPath(route);
    setNewPageName("");
    setNewPageRoute("");
    setShowPages(false);

    // Re-fetch pages and select the new one
    const freshPages = await qc.fetchQuery({
      queryKey: ["pages"],
      queryFn: async () => {
        const { data } = await client.api.pages.get();
        return (data ?? []) as PageInfo[];
      },
    });

    const created = freshPages?.find((p: PageInfo) => p.route === route);
    if (created) {
      setCurrentPage(created);
    }
  }, [newPageName, newPageRoute, newPageFramework, createPage, qc]);

  const handleDeletePage = useCallback(
    async (page: PageInfo) => {
      setDeletingRoute(page.route);
      try {
        // Navigate the preview away from the page we're about to delete.
        // This ensures the dev server isn't SSR-rendering the deleted page's
        // component when the HMR reload fires from modifying server.ts.
        const homePage = pages.find(
          (p) => p.route === "/" && p.route !== page.route,
        );
        setCurrentPage(homePage ?? null);
        setPreviewPath("/");

        // Give the iframe a moment to navigate before we trigger HMR
        await new Promise((r) => setTimeout(r, 300));

        const result = await deletePageMutation.mutateAsync({
          name: page.name,
          route: page.route,
          framework: page.framework,
        });

        if (result?.isLastPage) {
          setCleanupDialog({ framework: page.framework });
        } else if (result?.canConsolidate) {
          setConsolidateDialog(result.canConsolidate);
        }
      } finally {
        setDeletingRoute(null);
      }
    },
    [deletePageMutation, currentPage, pages],
  );

  const handleReorganizeConfirm = useCallback(async () => {
    if (!reorganizeDialog) return;
    await reorganizeMutation.mutateAsync(reorganizeDialog.framework);
    setReorganizeDialog(null);
  }, [reorganizeDialog, reorganizeMutation]);

  const handleConsolidateConfirm = useCallback(async () => {
    if (!consolidateDialog) return;
    await consolidateMutation.mutateAsync(consolidateDialog.framework);
    setConsolidateDialog(null);
  }, [consolidateDialog, consolidateMutation]);

  const handleCleanupConfirm = useCallback(async () => {
    if (!cleanupDialog) return;
    await cleanupMutation.mutateAsync(cleanupDialog.framework);
    setCleanupDialog(null);
  }, [cleanupDialog, cleanupMutation]);

  const handleSaveSource = useCallback(
    async (content: string) => {
      const savePath = activeTabPath ?? currentPage?.file;
      if (!savePath) return;
      await saveSource.mutateAsync({ file: savePath, content });
      setSourceContent(content);
      setTabs((prev) =>
        prev.map((t) => (t.path === savePath ? { ...t, content } : t)),
      );
    },
    [activeTabPath, currentPage, saveSource],
  );

  const handleRunScript = useCallback(
    async (name: string) => {
      setRunningScript(name);
      setScriptOutput("");
      setShowScripts(false);

      try {
        const result = await runScript.mutateAsync(name);
        if (result) {
          const output = [
            `$ bun run ${name}`,
            "",
            result.stdout,
            result.stderr ? `\nSTDERR:\n${result.stderr}` : "",
            "",
            `Exit code: ${result.exitCode}`,
          ]
            .filter(Boolean)
            .join("\n");
          setScriptOutput(output);
        }
      } catch (err) {
        setScriptOutput(`Failed to run script: ${err}`);
      } finally {
        setRunningScript(null);
      }
    },
    [runScript],
  );

  const handleTextChange = useCallback((value: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "__studio_update_text", value },
        "*",
      );
    }
  }, []);

  const handleAttributeChange = useCallback((name: string, value: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "__studio_update_attr", name, value },
        "*",
      );
    }
  }, []);

  const handleOpenEditor = useCallback(async () => {
    if (!currentPage?.file) return;
    await client.api["open-editor"].get({
      query: { file: currentPage.file },
    });
  }, [currentPage]);

  const handleNavigate = useCallback(
    async (path: string) => {
      if (!currentPage?.file) return;
      let fullPath: string;
      if (path.startsWith("./") || path.startsWith("../")) {
        const currentDir = currentPage.file.replace(/\/[^/]+$/, "");
        fullPath = `${currentDir}/${path}`;
      } else {
        fullPath = path;
      }

      // If already open in a tab, switch to it
      const existingTab = tabs.find((t) => t.path === fullPath);
      if (existingTab) {
        setActiveTabPath(fullPath);
        setSourceContent(existingTab.content);
        return;
      }

      // Fetch and open new tab
      const { data } = await client.api.source.get({
        query: { file: fullPath },
      });
      if (!data) return;

      const content = (data as { content: string }).content;
      const label = fullPath.split("/").pop() ?? fullPath;
      const ext = fullPath.split(".").pop();
      const fw =
        ext === "svelte"
          ? "svelte"
          : ext === "vue"
            ? "vue"
            : currentPage.framework;

      setTabs((prev) => [
        ...prev,
        { path: fullPath, label, content, framework: fw },
      ]);
      setActiveTabPath(fullPath);
      setSourceContent(content);
    },
    [currentPage, tabs],
  );

  const handleCloseTab = useCallback(
    (tabPath: string) => {
      setTabs((prev) => {
        const filtered = prev.filter((t) => t.path !== tabPath);
        if (activeTabPath === tabPath) {
          const idx = prev.findIndex((t) => t.path === tabPath);
          const next = filtered[Math.min(idx, filtered.length - 1)];
          setActiveTabPath(next?.path ?? null);
          setSourceContent(next?.content ?? "");
        }
        return filtered;
      });
    },
    [activeTabPath],
  );

  const handleTabSelect = useCallback(
    (tabPath: string) => {
      const tab = tabs.find((t) => t.path === tabPath);
      if (tab) {
        setActiveTabPath(tabPath);
        setSourceContent(tab.content);
      }
    },
    [tabs],
  );

  const handleIframeLoad = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "__studio_set_inspect_mode", enabled: inspectMode },
        "*",
      );
    }
  }, [inspectMode]);

  const handleToggleInspect = useCallback(() => {
    setInspectMode((prev) => {
      const next = !prev;
      if (!next) {
        setSelectedElement(null);
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            { type: "__studio_deselect" },
            "*",
          );
        }
      }
      return next;
    });
  }, []);

  const handleCloseInspector = useCallback(() => {
    setShowInspector(false);
    setSelectedElement(null);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "__studio_deselect" },
        "*",
      );
    }
  }, []);

  const handleSplitMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleMouseMove = (e: MouseEvent) => {
      const mainRect = mainEl.getBoundingClientRect();
      const x = e.clientX - mainRect.left;
      const newRatio = Math.min(80, Math.max(20, (x / mainRect.width) * 100));
      setSplitRatio(newRatio);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  // --- Derived ---
  const toggleCategory = useCallback((category: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }, []);

  const countComponentLeaves = (nodes: ComponentTreeNode[]): number => {
    let count = 0;
    for (const node of nodes) {
      if (node.children) count += countComponentLeaves(node.children);
      else count++;
    }
    return count;
  };

  const filteredCategories = Object.entries(ELEMENT_CATEGORIES)
    .map(([category, elements]) => {
      const filtered = searchQuery
        ? elements.filter((el) =>
            el.tag.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : elements;
      return [category, filtered] as [string, ElementInfo[]];
    })
    .filter(([, elements]) => elements.length > 0);

  const filterComponentTree = useCallback(
    (nodes: ComponentTreeNode[], query: string): ComponentTreeNode[] => {
      if (!query) return nodes;
      const q = query.toLowerCase();
      return nodes.reduce<ComponentTreeNode[]>((acc, node) => {
        if (node.children) {
          const filtered = filterComponentTree(node.children, query);
          if (filtered.length > 0) acc.push({ ...node, children: filtered });
        } else if (node.name.toLowerCase().includes(q)) {
          acc.push(node);
        }
        return acc;
      }, []);
    },
    [],
  );

  const filteredCustomComponents = searchQuery
    ? filterComponentTree(customComponents, searchQuery)
    : customComponents;

  const HIDDEN_SCRIPTS = new Set(["dev", "start", "build"]);
  const FEATURED_SCRIPTS: Record<
    string,
    { badge: string; gradient: string; description: string; order: number }
  > = {
    typecheck: {
      badge: "Typecheck",
      gradient: "linear-gradient(135deg, #3178c6, #60a5fa)",
      description: "Run the TypeScript type checker",
      order: 0,
    },
    format: {
      badge: "Format",
      gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
      description: "Auto-format source files",
      order: 1,
    },
    lint: {
      badge: "Lint",
      gradient: "linear-gradient(135deg, #d97706, #fbbf24)",
      description: "Check code for errors and warnings",
      order: 2,
    },
    test: {
      badge: "Test",
      gradient: "linear-gradient(135deg, #059669, #34d399)",
      description: "Run the test suite",
      order: 3,
    },
  };

  const filteredScripts = scripts
    .filter((s) => !HIDDEN_SCRIPTS.has(s.name))
    .sort((a, b) => {
      const aFeatured = FEATURED_SCRIPTS[a.name];
      const bFeatured = FEATURED_SCRIPTS[b.name];
      if (aFeatured && bFeatured) return aFeatured.order - bFeatured.order;
      if (aFeatured) return -1;
      if (bFeatured) return 1;
      return a.name.localeCompare(b.name);
    });

  const previewVisible = layout === "preview" || layout === "split";
  const sourceVisible = layout === "source" || layout === "split";

  const previewUrl = `/preview?path=${encodeURIComponent(previewPath)}`;

  const renderPreview = () => (
    <iframe
      ref={iframeRef}
      className="studio-preview-frame"
      src={previewUrl}
      title="Preview"
      onLoad={handleIframeLoad}
    />
  );

  const activeTab = tabs.find((t) => t.path === activeTabPath);

  const renderSource = () => (
    <div className="studio-source-editor">
      {tabs.length > 0 && (
        <div className="studio-tab-bar">
          {tabs.map((tab) => (
            <div
              key={tab.path}
              className={`studio-tab ${tab.path === activeTabPath ? "studio-tab-active" : ""}`}
              onClick={() => handleTabSelect(tab.path)}
              title={tab.path}
            >
              <span className="studio-tab-label">{tab.label}</span>
              {tabs.length > 1 && (
                <button
                  className="studio-tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTab(tab.path);
                  }}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <MonacoEditor
        deps={deps}
        types={types}
        value={activeTab?.content ?? sourceContent}
        framework={activeTab?.framework ?? currentPage?.framework}
        filePath={activeTab?.path ?? currentPage?.file}
        onChange={(val) => {
          setSourceContent(val);
          if (activeTabPath) {
            setTabs((prev) =>
              prev.map((t) =>
                t.path === activeTabPath ? { ...t, content: val } : t,
              ),
            );
          }
        }}
        onNavigate={handleNavigate}
        onSave={handleSaveSource}
      />
    </div>
  );

  return (
    <html lang="en">
      <StudioHead cssPath={cssPath} />
      <body className="studio-body">
        <div
          className={`studio-layout ${showPages || showScripts ? "studio-dropdown-open" : ""}`}
        >
          {/* Toolbar */}
          <div className="studio-toolbar" ref={toolbarRef}>
            <div className="studio-toolbar-left">
              {/* Desktop: individual panel button */}
              <button
                className={`studio-btn studio-desktop-only ${showSidebar ? "studio-btn-active" : ""}`}
                onClick={() => setShowSidebar(!showSidebar)}
                title="Toggle elements panel (Ctrl+B)"
              >
                <PanelLeftIcon />
                <span className="studio-panel-label">Elements</span>
              </button>

              {/* Mobile: combined panels dropdown */}
              <div
                className="studio-panels-dropdown studio-mobile-only"
                ref={panelsDropdownRef}
              >
                <button
                  className={`studio-btn studio-btn-icon ${showSidebar || showInspector ? "studio-btn-active" : ""}`}
                  onClick={() => setShowPanels(!showPanels)}
                  title="Toggle panels"
                >
                  <LayoutPanelsIcon />
                </button>
                {showPanels && (
                  <div className="studio-dropdown-menu">
                    <button
                      className={`studio-dropdown-item ${showSidebar ? "studio-dropdown-item-active" : ""}`}
                      onClick={() => {
                        if (showSidebar) {
                          setShowSidebar(false);
                        } else {
                          setShowSidebar(true);
                          if (showInspector) handleCloseInspector();
                        }
                        setShowPanels(false);
                      }}
                    >
                      <PanelLeftIcon />
                      Elements
                    </button>
                    <button
                      className={`studio-dropdown-item ${showInspector ? "studio-dropdown-item-active" : ""}`}
                      onClick={() => {
                        if (showInspector) {
                          handleCloseInspector();
                        } else {
                          setShowInspector(true);
                          setShowSidebar(false);
                        }
                        setShowPanels(false);
                      }}
                    >
                      <PanelRightIcon />
                      Inspector
                    </button>
                    <button
                      className={`studio-dropdown-item ${showScripts ? "studio-dropdown-item-active" : ""}`}
                      onClick={() => {
                        setShowScripts(!showScripts);
                        setShowPanels(false);
                      }}
                    >
                      Scripts
                      {runningScript && <span className="studio-spinner" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="studio-toolbar-center">
              {/* Pages dropdown */}
              <div className="studio-pages-dropdown" ref={pagesDropdownRef}>
                <button
                  className="studio-btn"
                  onClick={() => setShowPages(!showPages)}
                >
                  {currentPage?.route || "Select page"}
                  <svg
                    className="studio-caret"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{
                      transform: showPages ? "rotate(180deg)" : undefined,
                    }}
                  >
                    <path d="M2.5 3.5L5 6.5L7.5 3.5" />
                  </svg>
                </button>

                {showPages && (
                  <div className="studio-dropdown-menu">
                    <div className="studio-dropdown-header">Pages</div>
                    {pages.map((page) => (
                      <div
                        className={`studio-page-item ${
                          currentPage?.route === page.route
                            ? "studio-page-item-active"
                            : ""
                        }`}
                        key={page.route}
                      >
                        <button
                          className="studio-page-item-main"
                          onClick={() => handlePageSelect(page)}
                        >
                          <span className="studio-page-name">{page.route}</span>
                          <span className="studio-page-framework">
                            {page.framework}
                          </span>
                        </button>
                        <button
                          className="studio-page-delete"
                          disabled={deletingRoute === page.route}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePage(page);
                          }}
                          title={`Delete ${page.route}`}
                        >
                          {deletingRoute === page.route ? (
                            <span className="studio-spinner" />
                          ) : (
                            "\u00d7"
                          )}
                        </button>
                      </div>
                    ))}

                    <div className="studio-dropdown-divider" />
                    <div className="studio-dropdown-header">New Page</div>
                    <div className="studio-create-page">
                      <div className="studio-create-page-fields">
                        <input
                          placeholder="Page name..."
                          value={newPageName}
                          onChange={(e) => setNewPageName(e.target.value)}
                        />
                        <input
                          placeholder="/route..."
                          value={newPageRoute}
                          onChange={(e) => setNewPageRoute(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreatePage();
                          }}
                        />
                        <select
                          className="studio-create-page-select"
                          value={newPageFramework}
                          onChange={(e) => setNewPageFramework(e.target.value)}
                          disabled={createPage.isPending}
                        >
                          {frameworks.configured.map((c) => (
                            <option key={c.framework} value={c.framework}>
                              {c.framework}
                            </option>
                          ))}
                          {frameworks.available.length > 0 && (
                            <optgroup label="Add framework">
                              {frameworks.available.map((f) => (
                                <option key={f} value={f}>
                                  + {f}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                      </div>
                      <button
                        className="studio-btn"
                        disabled={
                          !newPageName.trim() ||
                          !newPageRoute.trim() ||
                          !newPageFramework ||
                          createPage.isPending
                        }
                        onClick={handleCreatePage}
                        title="Create page"
                      >
                        {createPage.isPending ? (
                          <span className="studio-spinner" />
                        ) : (
                          "+"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="studio-toolbar-divider" />

              {/* Layout toggle */}
              <div className="studio-view-toggle">
                <button
                  className={`studio-btn ${layout === "preview" ? "studio-btn-active" : ""}`}
                  onClick={() => setLayout("preview")}
                >
                  Preview
                </button>
                <button
                  className={`studio-btn ${layout === "source" ? "studio-btn-active" : ""}`}
                  onClick={() => setLayout("source")}
                >
                  Source
                </button>
                <button
                  className={`studio-btn studio-split-btn ${layout === "split" ? "studio-btn-active" : ""}`}
                  onClick={() => setLayout("split")}
                  title="Side-by-side view (Ctrl+\\)"
                >
                  <SplitIcon />
                  <span className="studio-split-label">Split</span>
                </button>
              </div>
            </div>

            <div className="studio-toolbar-right">
              {/* Inspect mode toggle */}
              <button
                className={`studio-btn studio-inspect-btn ${inspectMode ? "studio-inspect-active" : ""}`}
                onClick={handleToggleInspect}
                title="Select element to inspect (Esc to exit)"
              >
                <CursorIcon />
                <span className="studio-inspect-label">Select</span>
              </button>

              <div className="studio-toolbar-divider" />
              {/* Scripts dropdown */}
              <div className="studio-dropdown" ref={scriptsDropdownRef}>
                <button
                  className="studio-scripts-btn studio-desktop-only"
                  onClick={() => setShowScripts(!showScripts)}
                >
                  Scripts
                  {runningScript && <span className="studio-spinner" />}
                </button>

                {showScripts && (
                  <div className="studio-dropdown-menu studio-scripts-menu">
                    {filteredScripts.map((script) => {
                      const featured = FEATURED_SCRIPTS[script.name];
                      return (
                        <button
                          className={`studio-script-item ${featured ? "studio-script-featured" : ""}`}
                          key={script.name}
                          onClick={() => {
                            setShowScripts(false);
                            handleRunScript(script.name);
                          }}
                        >
                          <span
                            className="studio-script-badge"
                            style={{
                              background: featured
                                ? featured.gradient
                                : "var(--studio-surface-hover)",
                            }}
                          >
                            {featured ? featured.badge : script.name}
                          </span>
                          <div className="studio-script-item-info">
                            {featured && (
                              <span className="studio-script-item-desc">
                                {featured.description}
                              </span>
                            )}
                            <span className="studio-script-item-cmd">
                              {script.command}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Open in editor */}
              <button
                className="studio-btn studio-open-editor-btn"
                disabled={!currentPage}
                onClick={handleOpenEditor}
                title="Open in editor"
              >
                Open in Editor
              </button>

              {/* Inspector toggle */}
              <button
                className={`studio-btn studio-desktop-only ${showInspector ? "studio-btn-active" : ""}`}
                onClick={() =>
                  showInspector
                    ? handleCloseInspector()
                    : setShowInspector(true)
                }
                title="Toggle inspector panel"
              >
                <PanelRightIcon />
                <span className="studio-panel-label">Inspector</span>
              </button>
            </div>
          </div>

          <div className="studio-content">
            {/* Mobile backdrop for panel overlays */}
            {(showSidebar || showInspector) && (
              <div
                className="studio-panel-backdrop studio-mobile-only"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowSidebar(false);
                  if (showInspector) handleCloseInspector();
                }}
              />
            )}

            {/* Left sidebar - Elements */}
            {showSidebar && (
              <div className="studio-sidebar">
                <div
                  className="studio-sidebar-header"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className="studio-sidebar-title">Elements</span>
                  <button
                    className="studio-btn studio-btn-icon studio-btn-sm studio-mobile-only"
                    onClick={() => setShowSidebar(false)}
                    title="Close elements"
                  >
                    &times;
                  </button>
                </div>
                <input
                  className="studio-search-input"
                  placeholder="Search elements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="studio-elements-list">
                  {/* Custom section — only for component-based frameworks */}
                  {hasComponents &&
                    (!searchQuery || filteredCustomComponents.length > 0) && (
                      <div>
                        <div
                          className="studio-element-category studio-element-category-toggle"
                          onClick={() => toggleCategory("Custom")}
                        >
                          <span
                            className={`studio-category-chevron ${collapsedCategories.has("Custom") ? "" : "studio-category-chevron-open"}`}
                          >
                            &#9654;
                          </span>
                          <span>Custom</span>
                          <span className="studio-category-count">
                            {countComponentLeaves(filteredCustomComponents)}
                          </span>
                        </div>
                        {(!collapsedCategories.has("Custom") ||
                          searchQuery) && (
                          <div className="studio-component-tree">
                            {filteredCustomComponents.length === 0 ? (
                              <div className="studio-element-item studio-text-muted">
                                No components found
                              </div>
                            ) : (
                              <ComponentTree
                                nodes={flattenComponentTree(
                                  filteredCustomComponents,
                                )}
                                collapsedState={[
                                  componentFolderCollapsed,
                                  toggleComponentFolder,
                                ]}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )}

                  {/* HTML Element categories */}
                  {filteredCategories.map(([category, elements]) => (
                    <div key={category}>
                      <div
                        className="studio-element-category studio-element-category-toggle"
                        onClick={() => toggleCategory(category)}
                      >
                        <span
                          className={`studio-category-chevron ${collapsedCategories.has(category) ? "" : "studio-category-chevron-open"}`}
                        >
                          &#9654;
                        </span>
                        <span>{category}</span>
                        <span className="studio-category-count">
                          {elements.length}
                        </span>
                      </div>
                      {(!collapsedCategories.has(category) || searchQuery) &&
                        elements.map((el) => (
                          <div
                            className="studio-element-item"
                            draggable
                            key={el.tag}
                            onDragStart={(e) => {
                              e.dataTransfer.setData(
                                "text/plain",
                                `<${el.tag}></${el.tag}>`,
                              );
                            }}
                          >
                            <span>&lt;{el.tag}&gt;</span>
                            <span
                              className="studio-element-info-icon"
                              onMouseEnter={(e) => {
                                const rect =
                                  e.currentTarget.getBoundingClientRect();
                                setElementTooltip({
                                  text: el.description,
                                  x: rect.right + 8,
                                  y: rect.top + rect.height / 2,
                                });
                              }}
                              onMouseLeave={() => setElementTooltip(null)}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <circle
                                  cx="8"
                                  cy="8"
                                  r="7"
                                  stroke="currentColor"
                                  strokeWidth="1.2"
                                />
                                <text
                                  x="8"
                                  y="12"
                                  textAnchor="middle"
                                  fill="currentColor"
                                  fontSize="10"
                                  fontFamily="serif"
                                  fontStyle="italic"
                                >
                                  i
                                </text>
                              </svg>
                            </span>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Element tooltip portal */}
            {elementTooltip &&
              createPortal(
                <div
                  className="studio-element-tooltip"
                  style={{
                    left: elementTooltip.x,
                    top: elementTooltip.y,
                    transform: "translateY(-50%)",
                  }}
                >
                  {elementTooltip.text}
                </div>,
                document.body,
              )}

            {/* Main area */}
            <div
              className={`studio-main ${layout === "split" ? "studio-main-split" : ""}`}
              ref={mainRef}
            >
              <div
                className="studio-split-pane"
                style={{
                  flex: layout === "split" ? splitRatio : 1,
                  display: previewVisible ? undefined : "none",
                }}
              >
                {renderPreview()}
              </div>
              {layout === "split" && (
                <div
                  className="studio-resize-handle"
                  onMouseDown={handleSplitMouseDown}
                />
              )}
              <div
                className="studio-split-pane"
                style={{
                  flex: layout === "split" ? 100 - splitRatio : 1,
                  display: sourceVisible ? undefined : "none",
                }}
              >
                {renderSource()}
              </div>
            </div>

            {/* Right sidebar - Inspector */}
            {showInspector && (
              <div className="studio-inspector">
                <div
                  className="studio-inspector-header"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className="studio-inspector-title">Inspector</span>
                  <button
                    className="studio-btn studio-btn-icon studio-btn-sm"
                    onClick={handleCloseInspector}
                    title="Close inspector"
                  >
                    &times;
                  </button>
                </div>
                <ElementPanel
                  selectedElement={selectedElement}
                  onAttributeChange={handleAttributeChange}
                  onTextChange={handleTextChange}
                />
              </div>
            )}
          </div>

          {/* Bottom panel - Script output */}
          {scriptOutput && (
            <div className="studio-scripts-output">
              <div className="studio-scripts-output-header">
                <span>Script Output</span>
                <button
                  className="studio-btn"
                  onClick={() => setScriptOutput("")}
                >
                  Close
                </button>
              </div>
              <pre>{scriptOutput}</pre>
            </div>
          )}

          {/* Reorganize dialog */}
          {reorganizeDialog && (
            <div className="studio-dialog-overlay">
              <div className="studio-dialog">
                <div className="studio-dialog-title">Reorganize project?</div>
                <p className="studio-dialog-text">
                  You now have multiple frameworks. Would you like to move{" "}
                  <strong>{reorganizeDialog.framework}</strong> into its own
                  folder (
                  <code>
                    {reorganizeDialog.currentDirectory}/
                    {reorganizeDialog.framework}/
                  </code>
                  )?
                </p>
                <p className="studio-dialog-text studio-dialog-hint">
                  This keeps each framework in a separate directory and updates
                  your config and server imports automatically.
                </p>
                <div className="studio-dialog-actions">
                  <button
                    className="studio-btn"
                    onClick={() => setReorganizeDialog(null)}
                  >
                    No, keep as-is
                  </button>
                  <button
                    className="studio-btn studio-btn-primary"
                    disabled={reorganizeMutation.isPending}
                    onClick={handleReorganizeConfirm}
                  >
                    {reorganizeMutation.isPending ? (
                      <span className="studio-spinner" />
                    ) : (
                      "Yes, reorganize"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cleanup dialog */}
          {cleanupDialog && (
            <div className="studio-dialog-overlay">
              <div className="studio-dialog">
                <div className="studio-dialog-title">
                  Remove {cleanupDialog.framework}?
                </div>
                <p className="studio-dialog-text">
                  That was the last <strong>{cleanupDialog.framework}</strong>{" "}
                  page. Would you like to remove the framework directory, its
                  config entry, and uninstall its dependencies?
                </p>
                <div className="studio-dialog-actions">
                  <button
                    className="studio-btn"
                    onClick={() => setCleanupDialog(null)}
                  >
                    No, keep files
                  </button>
                  <button
                    className="studio-btn studio-btn-danger"
                    disabled={cleanupMutation.isPending}
                    onClick={handleCleanupConfirm}
                  >
                    {cleanupMutation.isPending ? (
                      <span className="studio-spinner" />
                    ) : (
                      "Yes, clean up"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Consolidate dialog */}
          {consolidateDialog && (
            <div className="studio-dialog-overlay">
              <div className="studio-dialog">
                <div className="studio-dialog-title">Consolidate project?</div>
                <p className="studio-dialog-text">
                  You only have one framework left. Would you like to move{" "}
                  <strong>{consolidateDialog.framework}</strong> back to the
                  root frontend folder (
                  <code>
                    {consolidateDialog.directory.replace(/\/[^/]+\/?$/, "/")}
                  </code>
                  )?
                </p>
                <div className="studio-dialog-actions">
                  <button
                    className="studio-btn"
                    onClick={() => setConsolidateDialog(null)}
                  >
                    No, keep as-is
                  </button>
                  <button
                    className="studio-btn studio-btn-primary"
                    disabled={consolidateMutation.isPending}
                    onClick={handleConsolidateConfirm}
                  >
                    {consolidateMutation.isPending ? (
                      <span className="studio-spinner" />
                    ) : (
                      "Yes, consolidate"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </body>
    </html>
  );
};

export const StudioEditor = (props: StudioEditorProps) => (
  <QueryClientProvider client={queryClient}>
    <StudioEditorInner {...props} />
  </QueryClientProvider>
);
