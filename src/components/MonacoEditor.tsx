import { useRef, useEffect, useCallback } from "react";
import { jsxMonarchLanguage } from "./jsxMonarch";

declare const require: any;
declare const monaco: any;

const CDN_URL = "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs";

type MonacoEditorProps = {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  readOnly?: boolean;
  types?: Record<string, string>;
  deps?: Record<string, string>;
  onNavigate?: (path: string) => void;
  height?: string;
};

export const MonacoEditor = ({
  value,
  language = "typescript",
  onChange,
  onSave,
  readOnly = false,
  types,
  deps,
  onNavigate,
  height = "100%",
}: MonacoEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const extraModelsRef = useRef<any[]>([]);
  const monacoRef = useRef<any>(null);
  const isInitializedRef = useRef(false);
  const onSaveRef = useRef(onSave);
  const onChangeRef = useRef(onChange);
  const onNavigateRef = useRef(onNavigate);

  onSaveRef.current = onSave;
  onChangeRef.current = onChange;
  onNavigateRef.current = onNavigate;

  const defineTheme = useCallback((m: any) => {
    m.editor.defineTheme("studio-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6c7086", fontStyle: "italic" },
        { token: "keyword", foreground: "cba6f7" },
        { token: "string", foreground: "a6e3a1" },
        { token: "string.escape", foreground: "f2cdcd" },
        { token: "number", foreground: "fab387" },
        { token: "number.float", foreground: "fab387" },
        { token: "number.hex", foreground: "fab387" },
        { token: "number.octal", foreground: "fab387" },
        { token: "number.binary", foreground: "fab387" },
        { token: "regexp", foreground: "f38ba8" },
        { token: "operator", foreground: "89dceb" },
        { token: "delimiter", foreground: "cdd6f4" },
        { token: "delimiter.bracket", foreground: "cdd6f4" },
        { token: "type.identifier", foreground: "89b4fa" },
        { token: "identifier", foreground: "cdd6f4" },
        { token: "tag", foreground: "89b4fa" },
        { token: "attribute.name", foreground: "fab387" },
        { token: "attribute.value", foreground: "a6e3a1" },
        { token: "annotation", foreground: "f9e2af" },
        { token: "invalid", foreground: "f38ba8" },
      ],
      colors: {
        "editor.background": "#1e1e2e",
        "editor.foreground": "#cdd6f4",
        "editor.lineHighlightBackground": "#2a2b3d",
        "editor.selectionBackground": "#44475a",
        "editor.inactiveSelectionBackground": "#3a3c50",
        "editorCursor.foreground": "#f5e0dc",
        "editorWhitespace.foreground": "#45475a",
        "editorIndentGuide.background": "#45475a",
        "editorIndentGuide.activeBackground": "#585b70",
        "editorLineNumber.foreground": "#6c7086",
        "editorLineNumber.activeForeground": "#cdd6f4",
        "editorBracketMatch.background": "#45475a80",
        "editorBracketMatch.border": "#89b4fa",
        "editor.findMatchBackground": "#f9e2af40",
        "editor.findMatchHighlightBackground": "#f9e2af20",
        "editorWidget.background": "#1e1e2e",
        "editorWidget.border": "#45475a",
        "editorSuggestWidget.background": "#1e1e2e",
        "editorSuggestWidget.border": "#45475a",
        "editorSuggestWidget.foreground": "#cdd6f4",
        "editorSuggestWidget.selectedBackground": "#44475a",
        "editorHoverWidget.background": "#1e1e2e",
        "editorHoverWidget.border": "#45475a",
        "input.background": "#313244",
        "input.foreground": "#cdd6f4",
        "input.border": "#45475a",
        "dropdown.background": "#1e1e2e",
        "dropdown.border": "#45475a",
        "list.hoverBackground": "#313244",
        "list.activeSelectionBackground": "#44475a",
        "scrollbarSlider.background": "#45475a80",
        "scrollbarSlider.hoverBackground": "#585b7080",
        "scrollbarSlider.activeBackground": "#6c708680",
        "minimap.background": "#181825",
      },
    });
  }, []);

  const registerLanguage = useCallback((m: any) => {
    m.languages.register({ id: "typescriptReact" });
    m.languages.setMonarchTokensProvider("typescriptReact", jsxMonarchLanguage);
    m.languages.register({ id: "typescriptJsx" });
    m.languages.setMonarchTokensProvider("typescriptJsx", jsxMonarchLanguage);
  }, []);

  const configureTypescript = useCallback((m: any) => {
    const tsDefaults = m.languages.typescript?.typescriptDefaults;
    if (!tsDefaults) return;

    tsDefaults.setCompilerOptions({
      jsx: 4, // JsxEmit.ReactJSX
      module: 99, // ModuleKind.ESNext
      target: 99, // ScriptTarget.ESNext
      moduleResolution: 2, // ModuleResolutionKind.Node
      esModuleInterop: true,
      allowJs: true,
      strict: false,
      allowNonTsExtensions: true,
      allowSyntheticDefaultImports: true,
      jsxImportSource: "react",
    });

    tsDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  }, []);

  const loadExtraModels = useCallback(
    (m: any) => {
      // Dispose existing extra models
      for (const model of extraModelsRef.current) {
        model.dispose();
      }
      extraModelsRef.current = [];

      const tsDefaults = m.languages.typescript?.typescriptDefaults;

      // Load type definitions
      if (types && tsDefaults) {
        for (const [path, content] of Object.entries(types)) {
          const uri = `file:///node_modules/${path}`;
          tsDefaults.addExtraLib(content, uri);

          const existingModel = m.editor.getModel(m.Uri.parse(uri));
          if (!existingModel) {
            const model = m.editor.createModel(
              content,
              "typescript",
              m.Uri.parse(uri),
            );
            extraModelsRef.current.push(model);
          }
        }
      }

      // Load dependency files
      if (deps) {
        for (const [path, content] of Object.entries(deps)) {
          const uri = `file:///src/${path}`;

          const existingModel = m.editor.getModel(m.Uri.parse(uri));
          if (existingModel) {
            existingModel.setValue(content);
          } else {
            const lang =
              path.endsWith(".tsx") || path.endsWith(".ts")
                ? "typescript"
                : "javascript";
            const model = m.editor.createModel(content, lang, m.Uri.parse(uri));
            extraModelsRef.current.push(model);
          }

          if (tsDefaults) {
            tsDefaults.addExtraLib(content, uri);
          }
        }
      }
    },
    [types, deps],
  );

  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return;

    const loaderScript = document.getElementById("monaco-loader");
    const initMonaco = () => {
      (window as any).require.config({ paths: { vs: CDN_URL } });
      (window as any).require(["vs/editor/editor.main"], (m: any) => {
        monacoRef.current = m;

        defineTheme(m);
        registerLanguage(m);
        configureTypescript(m);

        const modelUri = m.Uri.parse("file:///src/current.tsx");
        const model = m.editor.createModel(
          value,
          language === "typescript" ? "typescriptReact" : language,
          modelUri,
        );
        modelRef.current = model;

        const editor = m.editor.create(containerRef.current!, {
          model,
          theme: "studio-dark",
          fontSize: 13,
          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Monaco, 'Courier New', monospace",
          fontLigatures: true,
          lineNumbers: "on",
          minimap: { enabled: true, scale: 2, showSlider: "mouseover" },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: false,
          renderWhitespace: "selection",
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true, indentation: true },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          padding: { top: 12, bottom: 12 },
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showClasses: true,
            showFunctions: true,
            showVariables: true,
            showInterfaces: true,
            showModules: true,
          },
          readOnly,
          wordWrap: "off",
          folding: true,
          foldingHighlight: true,
          linkedEditing: true,
          renderLineHighlight: "all",
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            useShadows: false,
          },
        });

        editorRef.current = editor;

        // Handle content changes
        model.onDidChangeContent(() => {
          const currentValue = model.getValue();
          onChangeRef.current?.(currentValue);
        });

        // Ctrl+S / Cmd+S
        editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.KeyS, () => {
          const currentValue = model.getValue();
          onSaveRef.current?.(currentValue);
        });

        // Go-to-definition override
        m.languages.registerDefinitionProvider("typescriptReact", {
          provideDefinition(_model: any, position: any, _token: any) {
            const word = _model.getWordAtPosition(position);
            if (!word) return null;

            // Check if it matches a dep path
            const lineContent = _model.getLineContent(position.lineNumber);
            const importMatch = lineContent.match(/from\s+['"](\.[^'"]+)['"]/);

            if (importMatch && onNavigateRef.current) {
              const importPath = importMatch[1];
              onNavigateRef.current(importPath);
              return null;
            }

            return null;
          },
        });

        loadExtraModels(m);

        isInitializedRef.current = true;
      });
    };

    if (loaderScript) {
      // Loader already exists, just init
      if ((window as any).require) {
        initMonaco();
      } else {
        loaderScript.addEventListener("load", initMonaco);
      }
    } else {
      const script = document.createElement("script");
      script.id = "monaco-loader";
      script.src = `${CDN_URL}/loader.js`;
      script.onload = initMonaco;
      document.head.appendChild(script);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
      if (modelRef.current) {
        modelRef.current.dispose();
        modelRef.current = null;
      }
      for (const model of extraModelsRef.current) {
        model.dispose();
      }
      extraModelsRef.current = [];
      isInitializedRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update value when prop changes
  useEffect(() => {
    if (modelRef.current && editorRef.current) {
      const currentValue = modelRef.current.getValue();
      if (currentValue !== value) {
        modelRef.current.setValue(value);
      }
    }
  }, [value]);

  // Update extra models when types/deps change
  useEffect(() => {
    if (monacoRef.current && isInitializedRef.current) {
      loadExtraModels(monacoRef.current);
    }
  }, [types, deps, loadExtraModels]);

  // Update readOnly
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly });
    }
  }, [readOnly]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height,
        overflow: "hidden",
      }}
    />
  );
};
