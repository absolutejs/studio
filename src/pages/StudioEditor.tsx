import { useState, useEffect, useRef, useCallback } from "react";
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
  const [selectedElement, setSelectedElement] =
    useState<SelectedElement | null>(null);
  const [showScripts, setShowScripts] = useState(false);
  const [scriptOutput, setScriptOutput] = useState("");
  const [runningScript, setRunningScript] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

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

  // --- Sync source content from query ---
  useEffect(() => {
    if (sourceData?.content != null) {
      setSourceContent(sourceData.content);
    }
  }, [sourceData]);

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
      if (!currentPage?.file) return;
      await saveSource.mutateAsync({ file: currentPage.file, content });
      setSourceContent(content);
    },
    [currentPage, saveSource],
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
      const currentDir = currentPage.file.replace(/\/[^/]+$/, "");
      const fullPath = `${currentDir}/${path}`;
      const { data } = await client.api.source.get({
        query: { file: fullPath },
      });
      if (data) setSourceContent((data as { content: string }).content);
    },
    [currentPage],
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
