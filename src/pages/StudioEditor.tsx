import { useState, useEffect, useRef, useCallback } from "react";
import { MonacoEditor } from "../components/MonacoEditor";
import { ElementPanel } from "../components/ElementPanel";
import { StudioHead } from "../components/StudioHead";

type StudioEditorProps = {
  devServerUrl?: string;
  cssPath?: string;
};

type PageInfo = {
  name: string;
  path: string;
  framework: string;
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

type LayoutMode = "preview" | "source" | "split";

const ELEMENT_CATEGORIES: Record<string, string[]> = {
  Layout: [
    "div",
    "section",
    "article",
    "aside",
    "header",
    "footer",
    "main",
    "nav",
    "figure",
    "figcaption",
    "details",
    "summary",
    "dialog",
  ],
  Text: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "span",
    "a",
    "strong",
    "em",
    "b",
    "i",
    "u",
    "s",
    "small",
    "mark",
    "sub",
    "sup",
    "abbr",
    "cite",
    "code",
    "pre",
    "blockquote",
    "q",
    "kbd",
    "samp",
    "var",
    "time",
    "data",
    "ruby",
    "rt",
    "rp",
    "bdi",
    "bdo",
    "wbr",
    "br",
    "hr",
  ],
  Lists: ["ul", "ol", "li", "dl", "dt", "dd", "menu"],
  Table: [
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "caption",
    "colgroup",
    "col",
  ],
  Form: [
    "form",
    "input",
    "textarea",
    "select",
    "option",
    "optgroup",
    "button",
    "label",
    "fieldset",
    "legend",
    "datalist",
    "output",
    "progress",
    "meter",
  ],
  Media: [
    "img",
    "video",
    "audio",
    "source",
    "track",
    "picture",
    "canvas",
    "svg",
    "iframe",
    "embed",
    "object",
    "map",
    "area",
  ],
  Semantic: ["address", "hgroup", "search"],
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

export const StudioEditor = ({
  devServerUrl = "http://localhost:3000",
  cssPath,
}: StudioEditorProps) => {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [currentPage, setCurrentPage] = useState<PageInfo | null>(null);
  const [layout, setLayout] = useState<LayoutMode>("preview");
  const [sourceContent, setSourceContent] = useState("");
  const [selectedElement, setSelectedElement] =
    useState<SelectedElement | null>(null);
  const [showScripts, setShowScripts] = useState(false);
  const [scripts, setScripts] = useState<ScriptInfo[]>([]);
  const [scriptOutput, setScriptOutput] = useState("");
  const [runningScript, setRunningScript] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPages, setShowPages] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [types, setTypes] = useState<Record<string, string>>({});
  const [deps, setDeps] = useState<Record<string, string>>({});

  // New state for enhanced UX
  const [inspectMode, setInspectMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Fetch pages on mount
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch("/api/pages");
        const data = await res.json();
        setPages(data);
        if (data.length > 0 && !currentPage) {
          setCurrentPage(data[0]);
        }
      } catch (err) {
        console.error("[studio] Failed to fetch pages:", err);
      }
    };
    fetchPages();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch scripts on mount
  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const res = await fetch("/api/scripts");
        const data = await res.json();
        setScripts(data);
      } catch (err) {
        console.error("[studio] Failed to fetch scripts:", err);
      }
    };
    fetchScripts();
  }, []);

  // Set initial layout based on screen size
  useEffect(() => {
    const w = window.innerWidth;
    if (w >= 1200) {
      setShowSidebar(true);
    }
    if (w >= 1440) {
      setLayout("split");
    }
  }, []);

  // Fetch source when currentPage changes
  useEffect(() => {
    if (!currentPage) return;

    const fetchSource = async () => {
      try {
        const res = await fetch(
          `/api/source?file=${encodeURIComponent(currentPage.path)}`,
        );
        const data = await res.json();
        setSourceContent(data.content);
      } catch (err) {
        console.error("[studio] Failed to fetch source:", err);
      }
    };
    fetchSource();
  }, [currentPage]);

  // Fetch types and deps when source editor is visible
  useEffect(() => {
    if (layout !== "source" && layout !== "split") return;
    if (!currentPage) return;

    const fetchTypesAndDeps = async () => {
      try {
        const [typesRes, depsRes] = await Promise.all([
          fetch("/api/types"),
          fetch(`/api/deps?file=${encodeURIComponent(currentPage.path)}`),
        ]);
        const typesData = await typesRes.json();
        const depsData = await depsRes.json();
        setTypes(typesData);
        setDeps(depsData);
      } catch (err) {
        console.error("[studio] Failed to fetch types/deps:", err);
      }
    };
    fetchTypesAndDeps();
  }, [layout, currentPage]);

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
      // Escape to exit inspect mode
      if (e.key === "Escape" && inspectMode) {
        setInspectMode(false);
      }
      // Ctrl+\ to toggle split view
      if (e.key === "\\" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setLayout((prev) => (prev === "split" ? "preview" : "split"));
      }
      // Ctrl+B to toggle sidebar
      if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowSidebar((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inspectMode]);

  const handlePageSelect = useCallback((page: PageInfo) => {
    setCurrentPage(page);
    setShowPages(false);
    setSelectedElement(null);
  }, []);

  const handleCreatePage = useCallback(async () => {
    if (!newPageName.trim()) return;

    try {
      await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPageName.trim() }),
      });

      const res = await fetch("/api/pages");
      const data = await res.json();
      setPages(data);
      setNewPageName("");
    } catch (err) {
      console.error("[studio] Failed to create page:", err);
    }
  }, [newPageName]);

  const handleSaveSource = useCallback(
    async (content: string) => {
      if (!currentPage) return;

      try {
        await fetch("/api/source", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: currentPage.path,
            content,
          }),
        });
        setSourceContent(content);
      } catch (err) {
        console.error("[studio] Failed to save source:", err);
      }
    },
    [currentPage],
  );

  const handleRunScript = useCallback(async (name: string) => {
    setRunningScript(name);
    setScriptOutput("");
    setShowScripts(false);

    try {
      const res = await fetch("/api/scripts/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      const output = [
        `$ bun run ${name}`,
        "",
        data.stdout,
        data.stderr ? `\nSTDERR:\n${data.stderr}` : "",
        "",
        `Exit code: ${data.exitCode}`,
      ]
        .filter(Boolean)
        .join("\n");
      setScriptOutput(output);
    } catch (err) {
      setScriptOutput(`Failed to run script: ${err}`);
    } finally {
      setRunningScript(null);
    }
  }, []);

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
    if (!currentPage) return;

    try {
      await fetch(
        `/api/open-editor?file=${encodeURIComponent(currentPage.path)}`,
      );
    } catch (err) {
      console.error("[studio] Failed to open editor:", err);
    }
  }, [currentPage]);

  const handleNavigate = useCallback(
    async (path: string) => {
      if (!currentPage) return;

      try {
        const currentDir = currentPage.path.replace(/\/[^/]+$/, "");
        const fullPath = `${currentDir}/${path}`;

        const res = await fetch(
          `/api/source?file=${encodeURIComponent(fullPath)}`,
        );
        const data = await res.json();
        setSourceContent(data.content);
      } catch (err) {
        console.error("[studio] Failed to navigate:", err);
      }
    },
    [currentPage],
  );

  const handleIframeLoad = useCallback(() => {
    // Overlay script is pre-injected by the /preview proxy route.
    // Just sync the current inspect mode state.
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "__studio_set_inspect_mode",
          enabled: inspectMode,
        },
        "*",
      );
    }
  }, [inspectMode]);

  const handleToggleInspect = useCallback(() => {
    setInspectMode((prev) => {
      const next = !prev;
      if (!next) {
        // Deselect when turning off inspect mode
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

  // Split view resize handler
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

  const getPreviewUrl = () => {
    return "/preview";
  };

  const filteredCategories = Object.entries(ELEMENT_CATEGORIES)
    .map(([category, elements]) => {
      const filtered = searchQuery
        ? elements.filter((el) =>
            el.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : elements;
      return [category, filtered] as [string, string[]];
    })
    .filter(([, elements]) => elements.length > 0);

  const groupedScripts = scripts.reduce<Record<string, ScriptInfo[]>>(
    (acc, script) => {
      if (!acc[script.category]) {
        acc[script.category] = [];
      }
      acc[script.category]!.push(script);
      return acc;
    },
    {},
  );

  const previewVisible = layout === "preview" || layout === "split";
  const sourceVisible = layout === "source" || layout === "split";

  const renderPreview = () => (
    <iframe
      ref={iframeRef}
      className="studio-preview-frame"
      src={getPreviewUrl()}
      title="Preview"
      onLoad={handleIframeLoad}
    />
  );

  const renderSource = () => (
    <div className="studio-source-editor">
      <MonacoEditor
        deps={deps}
        types={types}
        value={sourceContent}
        onChange={setSourceContent}
        onNavigate={handleNavigate}
        onSave={handleSaveSource}
      />
    </div>
  );

  return (
    <html lang="en">
      <StudioHead cssPath={cssPath} />
      <body className="studio-body">
        <div className="studio-layout">
          {/* Toolbar */}
          <div className="studio-toolbar">
            <div className="studio-logo">ABSOLUTE STUDIO</div>

            <div className="studio-toolbar-left">
              {/* Sidebar toggle */}
              <button
                className={`studio-btn ${showSidebar ? "studio-btn-active" : ""}`}
                onClick={() => setShowSidebar(!showSidebar)}
                title="Toggle elements panel (Ctrl+B)"
              >
                <PanelLeftIcon />
                <span className="studio-panel-label">Elements</span>
              </button>
            </div>

            <div className="studio-toolbar-center">
              {/* Pages dropdown */}
              <div className="studio-pages-dropdown">
                <button
                  className="studio-btn"
                  onClick={() => setShowPages(!showPages)}
                >
                  {currentPage?.name || "Select page"}
                  <span className="studio-caret">
                    {showPages ? "\u25B2" : "\u25BC"}
                  </span>
                </button>

                {showPages && (
                  <div className="studio-dropdown-menu">
                    {pages.map((page) => (
                      <button
                        className={`studio-page-item ${
                          currentPage?.path === page.path
                            ? "studio-page-item-active"
                            : ""
                        }`}
                        key={page.path}
                        onClick={() => handlePageSelect(page)}
                      >
                        <span className="studio-page-name">{page.name}</span>
                        <span className="studio-page-framework">
                          {page.framework}
                        </span>
                      </button>
                    ))}

                    <div className="studio-create-page">
                      <input
                        className="studio-search-input"
                        placeholder="New page name..."
                        value={newPageName}
                        onChange={(e) => setNewPageName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreatePage();
                        }}
                      />
                      <button className="studio-btn" onClick={handleCreatePage}>
                        +
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

              <div className="studio-toolbar-divider" />

              {/* Inspect mode toggle */}
              <button
                className={`studio-btn studio-inspect-btn ${inspectMode ? "studio-inspect-active" : ""}`}
                onClick={handleToggleInspect}
                title="Select element to inspect (Esc to exit)"
              >
                <CursorIcon />
                <span className="studio-inspect-label">Select</span>
              </button>
            </div>

            <div className="studio-toolbar-right">
              {/* Scripts dropdown */}
              <div className="studio-dropdown">
                <button
                  className="studio-scripts-btn"
                  onClick={() => setShowScripts(!showScripts)}
                >
                  Scripts
                  {runningScript && <span className="studio-spinner" />}
                </button>

                {showScripts && (
                  <div className="studio-dropdown-menu studio-scripts-menu">
                    {Object.entries(groupedScripts).map(
                      ([category, categoryScripts]) => (
                        <div key={category}>
                          <div className="studio-script-category">
                            {category}
                          </div>
                          {categoryScripts.map((script) => (
                            <button
                              className="studio-page-item"
                              key={script.name}
                              onClick={() => handleRunScript(script.name)}
                            >
                              <span className="studio-page-name">
                                {script.name}
                              </span>
                              <span className="studio-page-framework">
                                {script.command}
                              </span>
                            </button>
                          ))}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* Open in editor */}
              <button
                className="studio-btn"
                disabled={!currentPage}
                onClick={handleOpenEditor}
                title="Open in editor"
              >
                Open in Editor
              </button>

              {/* Inspector toggle */}
              <button
                className={`studio-btn ${showInspector ? "studio-btn-active" : ""}`}
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
            {/* Left sidebar - Elements */}
            {showSidebar && (
              <div className="studio-sidebar">
                <input
                  className="studio-search-input"
                  placeholder="Search elements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="studio-elements-list">
                  {filteredCategories.map(([category, elements]) => (
                    <div key={category}>
                      <div className="studio-element-category">{category}</div>
                      {elements.map((el) => (
                        <div
                          className="studio-element-item"
                          draggable
                          key={el}
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              "text/plain",
                              `<${el}></${el}>`,
                            );
                          }}
                        >
                          &lt;{el}&gt;
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main area */}
            <div
              className={`studio-main ${layout === "split" ? "studio-main-split" : ""}`}
              ref={mainRef}
            >
              {layout === "split" ? (
                <>
                  <div
                    className="studio-split-pane"
                    style={{ flex: splitRatio }}
                  >
                    {renderPreview()}
                  </div>
                  <div
                    className="studio-resize-handle"
                    onMouseDown={handleSplitMouseDown}
                  />
                  <div
                    className="studio-split-pane"
                    style={{
                      flex: 100 - splitRatio,
                    }}
                  >
                    {renderSource()}
                  </div>
                </>
              ) : previewVisible ? (
                renderPreview()
              ) : sourceVisible ? (
                renderSource()
              ) : null}
            </div>

            {/* Right sidebar - Inspector */}
            {showInspector && (
              <div className="studio-inspector">
                <div className="studio-inspector-header">
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
        </div>
      </body>
    </html>
  );
};
