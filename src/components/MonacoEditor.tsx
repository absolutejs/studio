import { useRef, useEffect, useCallback } from "react";
import { jsxMonarchLanguage } from "./jsxMonarch";
import { svelteMonarchLanguage } from "./svelteMonarch";
import { vueMonarchLanguage } from "./vueMonarch";
import {
  getHtmlTagDoc,
  getHtmlAttrDoc,
  getCssPropertyDoc,
  getHtmlTagNames,
  getHtmlTagSummary,
  getCssPropertyNames,
  getCssPropertySummary,
  getVueDirectiveDoc,
  getSvelteDirectiveDoc,
  getSvelteBlockDoc,
} from "./sfcHoverData";

declare const require: any;

const CDN_URL = "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs";
const CDN_BASE = "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/";

/**
 * CRITICAL: React, Angular, and plain TS/JS MUST use "typescript" (not a
 * custom Monarch language) — only "typescript" and "javascript" language IDs
 * are wired to the built-in TypeScript worker that provides hover-types,
 * diagnostics, autocompletion and go-to-definition.
 */
const getLanguageId = (framework?: string): string => {
  switch (framework) {
    case "svelte":
      return "svelte";
    case "vue":
      return "vue";
    case "html":
    case "htmx":
      return "html";
    default:
      return "typescript";
  }
};

/** Infer language from file extension for navigated-to files. */
const getLangFromPath = (path: string): string => {
  if (path.endsWith(".svelte")) return "svelte";
  if (path.endsWith(".vue")) return "vue";
  if (path.endsWith(".html") || path.endsWith(".htm")) return "html";
  return "typescript";
};

type MonacoEditorProps = {
  value: string;
  framework?: string;
  filePath?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  readOnly?: boolean;
  types?: Record<string, string>;
  deps?: Record<string, string>;
  onNavigate?: (path: string) => void;
  height?: string;
};

/** Build virtual script URI in the same directory as the SFC so relative imports resolve correctly */
const getVirtualScriptUri = (sfcPath?: string) => {
  if (sfcPath) {
    const dir = sfcPath.startsWith("/") ? sfcPath : `/${sfcPath}`;
    const lastSlash = dir.lastIndexOf("/");
    return `file://${dir.slice(0, lastSlash + 1)}__virtual_script_block.tsx`;
  }
  return "file:///src/__virtual_script_block.tsx";
};
const VIRTUAL_SCRIPT_URI_DEFAULT = "file:///src/__virtual_script_block.tsx";

export const MonacoEditor = ({
  value,
  framework,
  filePath,
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
  const extraModelsRef = useRef<Map<string, any>>(new Map());
  const extraLibsRef = useRef<Map<string, any>>(new Map());
  const monacoRef = useRef<any>(null);
  const isInitializedRef = useRef(false);
  const scriptBlockLibRef = useRef<any>(null);
  const scriptBlockModelRef = useRef<any>(null);
  const virtualScriptUriRef = useRef(VIRTUAL_SCRIPT_URI_DEFAULT);
  const onSaveRef = useRef(onSave);
  const onChangeRef = useRef(onChange);
  const onNavigateRef = useRef(onNavigate);
  const valueRef = useRef(value);
  const frameworkRef = useRef(framework);
  const filePathRef = useRef(filePath);
  // Store view states per URI for tab-like model switching
  const viewStatesRef = useRef<Map<string, any>>(new Map());
  // Track the onDidChangeContent disposable so we can rebind on model swap
  const contentListenerRef = useRef<any>(null);
  // Track diagnostic marker interval
  const diagnosticIntervalRef = useRef<any>(null);

  onSaveRef.current = onSave;
  onChangeRef.current = onChange;
  onNavigateRef.current = onNavigate;
  valueRef.current = value;
  frameworkRef.current = framework;
  filePathRef.current = filePath;

  const buildModelUri = useCallback((m: any, fp?: string) => {
    if (fp) {
      const normalized = fp.startsWith("/") ? fp : `/${fp}`;
      return m.Uri.parse(`file://${normalized}`);
    }
    return m.Uri.parse("file:///src/current.tsx");
  }, []);

  // ── Theme ──────────────────────────────────────────────────────
  const defineTheme = useCallback((m: any) => {
    m.editor.defineTheme("studio-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        // ── General (VSCode Dark+ matching) ──────────
        // Each token needs explicit .svelte/.vue/.tsx variants because
        // Monarch appends tokenPostfix and Monaco uses exact matching.
        ...([
          ["comment", "6A9955", "italic"],
          ["comment.html", "6A9955", "italic"],
          ["keyword", "569CD6"],
          ["keyword.import", "C586C0"],
          ["keyword.control", "C586C0"],
          ["string", "CE9178"],
          ["string.html", "CE9178"],
          ["string.escape", "D7BA7D"],
          ["number", "B5CEA8"],
          ["number.float", "B5CEA8"],
          ["number.hex", "B5CEA8"],
          ["regexp", "D16969"],
          ["operator", "D4D4D4"],
          ["delimiter", "D4D4D4"],
          ["delimiter.html", "808080"],
          ["delimiter.angle", "808080"],
          ["delimiter.bracket", "D4D4D4"],
          ["delimiter.parenthesis", "DCDCAA"],
          ["delimiter.square", "D4D4D4"],
          ["type", "4EC9B0"],
          ["type.identifier", "4EC9B0"],
          ["variable", "9CDCFE"],
          ["identifier", "9CDCFE"],
          ["annotation", "DCDCAA"],
          ["invalid", "F44747"],
          ["tag", "569CD6"],
          ["tag.component", "4EC9B0"],
          ["tag.css", "D7BA7D"],
          ["attribute.name", "9CDCFE"],
          ["attribute.value", "CE9178"],
          ["meta.directive", "C586C0"],
          ["keyword.css", "C586C0"],
          ["function.css", "DCDCAA"],
        ].flatMap(([token, fg, style]) => {
          const rule = {
            token: token!,
            foreground: fg!,
            ...(style ? { fontStyle: style } : {}),
          };
          return [
            rule,
            { ...rule, token: `${token}.svelte` },
            { ...rule, token: `${token}.vue` },
            { ...rule, token: `${token}.tsx` },
          ];
        }) as any[]),
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
        "editorBracketHighlight.foreground1": "#FFD700",
        "editorBracketHighlight.foreground2": "#DA70D6",
        "editorBracketHighlight.foreground3": "#87CEFA",
        "editorBracketHighlight.foreground4": "#FFD700",
        "editorBracketHighlight.foreground5": "#DA70D6",
        "editorBracketHighlight.foreground6": "#87CEFA",
      },
    });
  }, []);

  // ── SFC script-block helpers ──────────────────────────────────
  const getScriptBlock = useCallback((sfcContent: string) => {
    const match = sfcContent.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    if (!match) return null;

    const raw = match[1]!;
    const trimmed = raw.trim();
    if (!trimmed) return null;

    const tagStart = sfcContent.indexOf(match[0]);
    const tagEnd = sfcContent.indexOf(">", tagStart) + 1;
    // Line where the script content begins (0-indexed line count before)
    const linesBefore = sfcContent.slice(0, tagEnd).split("\n").length;

    // Count leading newlines that .trim() removes
    const leadingChars = raw.length - raw.trimStart().length;
    const leadingNewlines =
      leadingChars > 0
        ? (raw.slice(0, leadingChars).match(/\n/g) || []).length
        : 0;

    return { trimmed, linesBefore, leadingNewlines };
  }, []);

  /** Map SFC line → virtual script block line. Returns null if outside script. */
  const sfcToScriptLine = useCallback(
    (sfcContent: string, sfcLine: number): number | null => {
      const block = getScriptBlock(sfcContent);
      if (!block) return null;
      const mapped = sfcLine - block.linesBefore - block.leadingNewlines + 1;
      if (mapped < 1 || mapped > block.trimmed.split("\n").length) return null;
      return mapped;
    },
    [getScriptBlock],
  );

  /** Map virtual script block line → SFC line. */
  const scriptToSfcLine = useCallback(
    (sfcContent: string, scriptLine: number): number => {
      const block = getScriptBlock(sfcContent);
      if (!block) return scriptLine;
      return scriptLine + block.linesBefore + block.leadingNewlines - 1;
    },
    [getScriptBlock],
  );

  /** Detect which SFC section a line falls in: "template", "script", "style".
   *  For Svelte (no explicit <template> tag), content outside script/style = "template".
   *  For Vue (explicit <template> tag), content outside all blocks = null.
   */
  const getSfcSection = useCallback(
    (
      sfcContent: string,
      lineNumber: number,
      lang?: string,
    ): "template" | "script" | "style" | null => {
      const lines = sfcContent.split("\n");
      if (lineNumber < 1 || lineNumber > lines.length) return null;

      let section: "template" | "script" | "style" | null = null;
      for (let i = 0; i < lineNumber; i++) {
        const line = lines[i]!;
        if (/<template[\s>]/.test(line)) section = "template";
        else if (/<\/template>/.test(line)) section = null;
        else if (/<script[\s>]/.test(line)) section = "script";
        else if (/<\/script>/.test(line)) section = null;
        else if (/<style[\s>]/.test(line)) section = "style";
        else if (/<\/style>/.test(line)) section = null;
      }
      // Svelte: no <template> tag — anything outside script/style IS template
      if (section === null && lang === "svelte") {
        return "template";
      }
      return section;
    },
    [],
  );

  // ── Language registration ──────────────────────────────────────
  const registerLanguages = useCallback(
    (m: any) => {
      // Override built-in TypeScript tokenizer with JSX-aware Monarch
      // that differentiates import/export (magenta), types (green), etc.
      // The TS worker binding is separate — it stays connected to "typescript".
      m.languages.setMonarchTokensProvider("typescript", jsxMonarchLanguage);

      m.languages.register({ id: "svelte", extensions: [".svelte"] });
      m.languages.setMonarchTokensProvider("svelte", svelteMonarchLanguage);
      m.languages.setLanguageConfiguration("svelte", {
        brackets: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"],
        ],
        autoClosingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: "'", close: "'", notIn: ["string"] },
          { open: '"', close: '"', notIn: ["string"] },
          { open: "`", close: "`", notIn: ["string"] },
        ],
        colorizedBracketPairs: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"],
        ],
      });

      m.languages.register({ id: "vue", extensions: [".vue"] });
      m.languages.setMonarchTokensProvider("vue", vueMonarchLanguage);
      m.languages.setLanguageConfiguration("vue", {
        brackets: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"],
        ],
        autoClosingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: "'", close: "'", notIn: ["string"] },
          { open: '"', close: '"', notIn: ["string"] },
          { open: "`", close: "`", notIn: ["string"] },
        ],
        colorizedBracketPairs: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"],
        ],
      });

      // Helper: get TS worker client for the virtual script model
      // Re-resolves the URI each time so it tracks file switches
      const getWorkerClient = async () => {
        const virtualUri = m.Uri.parse(virtualScriptUriRef.current);
        const virtualModel = m.editor.getModel(virtualUri);
        if (!virtualModel) return null;
        const getWorker = m.languages.typescript?.getTypeScriptWorker;
        if (!getWorker) return null;
        const worker = await getWorker();
        return { client: await worker(virtualUri), virtualModel };
      };

      for (const langId of ["svelte", "vue"]) {
        // ── Hover provider (script + template + style) ───────
        m.languages.registerHoverProvider(langId, {
          provideHover: async (model: any, position: any) => {
            const sfcContent = model.getValue();
            const section = getSfcSection(
              sfcContent,
              position.lineNumber,
              langId,
            );
            const word = model.getWordAtPosition(position);
            const range = word
              ? {
                  startLineNumber: position.lineNumber,
                  startColumn: word.startColumn,
                  endLineNumber: position.lineNumber,
                  endColumn: word.endColumn,
                }
              : {
                  startLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endLineNumber: position.lineNumber,
                  endColumn: position.column,
                };

            // ── Tag line hovers (script, style, template, lang, setup, scoped) ──
            if (word) {
              const lineText = model.getLineContent(position.lineNumber);
              const onTagLine = /^\s*<\/?(script|style|template)\b/.test(
                lineText,
              );
              if (onTagLine) {
                const vueScriptDoc =
                  "Each `*.vue` file can contain at most one `<script>` block (excluding `<script setup>`).\n\nThe script is executed as an ES Module.\n\nThe **default export** should be a Vue component options object, either as a plain object or as the return value of `defineComponent`.";
                const vueScriptSetupDoc =
                  "Each `*.vue` file can contain at most one `<script setup>` block (excluding normal `<script>`).\n\nThe script is pre-processed and used as the component's `setup()` function, which means it will be executed **for each instance of the component**. Top-level bindings in `<script setup>` are automatically exposed to the template.";
                const vueStyleDoc =
                  "A single `*.vue` file can contain multiple `<style>` tags.\n\nA `<style>` tag can have `scoped` or `module` attributes to encapsulate the styles to the current component.";
                const vueTemplateDoc =
                  "Each `*.vue` file can contain at most one top-level `<template>` block.\n\nContents will be extracted and passed on to `@vue/compiler-dom`, pre-compiled into JavaScript render functions, and attached to the exported component as its `render` option.";
                const svelteScriptDoc =
                  'A `<script>` block contains JavaScript (or TypeScript with `lang="ts"`) that runs when a component instance is created.\n\nVariables declared (or imported) at the top level can be referenced in the component\'s markup.';
                const svelteStyleDoc =
                  "CSS inside a `<style>` block will be scoped to that component.\n\nYou can use `:global(...)` to apply styles outside the component scope.";
                const isVue = langId === "vue";
                const isSetupScript = /\bsetup\b/.test(lineText);
                const tagDocs: Record<string, string> = {
                  script: isVue
                    ? isSetupScript
                      ? vueScriptSetupDoc
                      : vueScriptDoc
                    : svelteScriptDoc,
                  style: isVue ? vueStyleDoc : svelteStyleDoc,
                  template: vueTemplateDoc,
                  lang: '**`lang`**\n\nSpecifies the language preprocessor for this block.\n\nCommon values: `"ts"`, `"typescript"`, `"scss"`, `"less"`, `"pug"`.',
                  setup:
                    "**`setup`**\n\nEnables `<script setup>` syntax — a compile-time syntactic sugar for using Composition API inside Single-File Components.\n\nTop-level bindings (variables, function declarations, and imports) declared in `<script setup>` are directly usable in the template.",
                  scoped:
                    "**`scoped`**\n\nWhen a `<style>` tag has the `scoped` attribute, its CSS will apply to elements of the current component only.\n\nChild component root elements will be affected by both the parent's scoped CSS and the child's scoped CSS.",
                };
                const doc = tagDocs[word.word];
                if (doc) return { contents: [{ value: doc }], range };
              }
            }

            // ── Script block: proxy to TS worker ─────────
            if (section === "script") {
              const scriptLine = sfcToScriptLine(
                sfcContent,
                position.lineNumber,
              );
              if (scriptLine === null) return null;

              const result = await getWorkerClient();
              if (!result) return null;
              const { client, virtualModel } = result;

              const offset = virtualModel.getOffsetAt({
                lineNumber: scriptLine,
                column: position.column,
              });
              const info = await client.getQuickInfoAtPosition(
                virtualScriptUriRef.current,
                offset,
              );
              if (!info) return null;

              const displayParts =
                info.displayParts?.map((p: any) => p.text).join("") ?? "";
              const docs =
                info.documentation?.map((d: any) => d.text).join("\n") ?? "";

              // Format JSDoc tags (@see, @param, @returns, etc.)
              const tags = info.tags ?? [];
              const tagLines: string[] = [];
              for (const tag of tags) {
                const tagText =
                  tag.text?.map((t: any) => t.text).join("") ?? "";
                if (tagText || tag.name === "see") {
                  tagLines.push(`*@${tag.name}* ${tagText}`);
                }
              }

              if (!displayParts && !docs && tagLines.length === 0) return null;

              const contents: any[] = [];
              if (displayParts) {
                contents.push({
                  value: "```typescript\n" + displayParts + "\n```",
                });
              }
              if (docs) {
                contents.push({ value: docs });
              }
              if (tagLines.length > 0) {
                contents.push({ value: tagLines.join("\n\n") });
              }
              return { contents, range };
            }

            // ── Template block: HTML element + directive docs ────
            if (section === "template" && word) {
              const lineText = model.getLineContent(position.lineNumber);
              const tag = word.word.toLowerCase();
              const fw =
                langId === "vue"
                  ? "vue"
                  : langId === "svelte"
                    ? "svelte"
                    : undefined;

              // Svelte special elements: svelte:head, svelte:body, etc.
              if (fw === "svelte") {
                const svelteElemRe = /svelte:(\w+)/g;
                let svelteMatch;
                while ((svelteMatch = svelteElemRe.exec(lineText)) !== null) {
                  const matchStart = svelteMatch.index + 1; // 1-based column
                  const matchEnd = matchStart + svelteMatch[0].length;
                  if (
                    position.column >= matchStart &&
                    position.column <= matchEnd
                  ) {
                    const svelteElemDocs: Record<string, string> = {
                      "svelte:head":
                        "**`<svelte:head>`**\n\nInserts elements into the `<head>` of the document.\n\nDuring SSR, content is added to `<head>` separately from the main output.",
                      "svelte:body":
                        "**`<svelte:body>`**\n\nAllows you to add event listeners to `document.body`.",
                      "svelte:window":
                        "**`<svelte:window>`**\n\nAllows you to add event listeners and bind to properties on `window`.",
                      "svelte:document":
                        "**`<svelte:document>`**\n\nAllows you to add event listeners to `document`.",
                      "svelte:element":
                        "**`<svelte:element>`**\n\nRenders a dynamic HTML element. The `this` attribute specifies the tag name.",
                      "svelte:component":
                        "**`<svelte:component>`**\n\nRenders a component dynamically. The `this` attribute specifies the constructor.",
                      "svelte:self":
                        "**`<svelte:self>`**\n\nAllows a component to contain itself recursively.",
                      "svelte:fragment":
                        "**`<svelte:fragment>`**\n\nPlaces content in a named slot without a wrapper element.",
                      "svelte:options":
                        "**`<svelte:options>`**\n\nSpecifies per-component compiler options.",
                      "svelte:boundary":
                        "**`<svelte:boundary>`**\n\nDefines an error boundary that catches errors from child components.",
                    };
                    const doc = svelteElemDocs[svelteMatch[0]];
                    if (doc) {
                      return {
                        contents: [{ value: doc }],
                        range: {
                          startLineNumber: position.lineNumber,
                          startColumn: matchStart,
                          endLineNumber: position.lineNumber,
                          endColumn: matchEnd,
                        },
                      };
                    }
                  }
                }
              }

              // Vue directives: check for v-*, @event, :prop before the word
              if (fw === "vue") {
                const charBefore =
                  word.startColumn > 1
                    ? (lineText[word.startColumn - 2] ?? "")
                    : "";
                // @event shorthand — get DOM event type from TS worker
                if (charBefore === "@") {
                  const eventName = word.word;
                  // Find the parent element tag on this or preceding lines
                  const textSoFar =
                    sfcContent
                      .split("\n")
                      .slice(0, position.lineNumber)
                      .join("\n") +
                    "\n" +
                    lineText.slice(0, word.startColumn - 1);
                  const tagMatch = textSoFar.match(/<(\w+)(?:\s[^>]*)?$/);
                  const parentTag = tagMatch?.[1]?.toLowerCase();
                  const result = await getWorkerClient();
                  if (result && parentTag) {
                    const { client, virtualModel } = result;
                    const htmlTag =
                      parentTag.charAt(0).toUpperCase() + parentTag.slice(1);
                    const elemType = `HTML${htmlTag}Element`;
                    const camelEvent =
                      eventName.charAt(0).toUpperCase() + eventName.slice(1);
                    const propName = `on${eventName}`;
                    const displayPropName = `on${camelEvent}`;
                    const helperLine = `\ndeclare const __hover_el: ${elemType}; __hover_el.${propName};`;
                    const origText = virtualModel.getValue();
                    try {
                      virtualModel.setValue(origText + helperLine);
                      const fullText = virtualModel.getValue();
                      const propOffset = fullText.lastIndexOf(propName);
                      const info = await client.getQuickInfoAtPosition(
                        virtualScriptUriRef.current,
                        propOffset,
                      );
                      if (info) {
                        let displayParts =
                          info.displayParts?.map((p: any) => p.text).join("") ??
                          "";
                        if (displayParts) {
                          // Transform DOM type to Vue-style display
                          displayParts = displayParts
                            .replace(`on${eventName}`, `${displayPropName}`)
                            .replace(/GlobalEventHandlers\./, "")
                            .replace(
                              /\(this:\s*GlobalEventHandlers,\s*ev:\s*/g,
                              "(payload: ",
                            )
                            .replace(/\)\s*=>\s*any/, ") => void) | undefined")
                            .replace(/:(\s*)\(/, `?:$1((`);
                          return {
                            contents: [
                              {
                                value:
                                  "```typescript\n" + displayParts + "\n```",
                              },
                            ],
                            range,
                          };
                        }
                      }
                    } finally {
                      virtualModel.setValue(origText);
                    }
                  }
                  // Fallback to static docs
                  const doc = getVueDirectiveDoc("@" + eventName);
                  if (doc) return { contents: [{ value: doc }], range };
                }
                // :prop shorthand — look up the prop's type from TS worker
                if (charBefore === ":") {
                  const propName = word.word;
                  const textSoFar =
                    sfcContent
                      .split("\n")
                      .slice(0, position.lineNumber)
                      .join("\n") +
                    "\n" +
                    lineText.slice(0, word.startColumn - 1);
                  const tagMatch = textSoFar.match(/<(\w+)(?:\s[^>]*)?$/);
                  const parentTag = tagMatch?.[1];
                  const result = await getWorkerClient();
                  if (result && parentTag) {
                    const { client, virtualModel } = result;
                    const isComponent = /^[A-Z]/.test(parentTag);
                    let helperLine: string;
                    if (isComponent) {
                      // Component — find the import path from the script block
                      // and look up its props type via the synthetic declaration
                      const scriptText = virtualModel.getValue();
                      const importMatch = scriptText.match(
                        new RegExp(
                          `import\\s+${parentTag}\\s+from\\s+['"]([^'"]+)['"]`,
                        ),
                      );
                      if (importMatch) {
                        helperLine =
                          `\nimport __hover_comp from '${importMatch[1]}';\n` +
                          `type __hover_props = typeof __hover_comp extends { new(props: infer P): any } ? P : ` +
                          `typeof __hover_comp extends { $props: infer P } ? P : any;\n` +
                          `declare const __hover_p: __hover_props;\n` +
                          `__hover_p.${propName};`;
                      } else {
                        // Fallback: try default import name as-is
                        helperLine =
                          `\ntype __hover_props = typeof ${parentTag} extends { new(props: infer P): any } ? P : ` +
                          `typeof ${parentTag} extends { $props: infer P } ? P : any;\n` +
                          `declare const __hover_p: __hover_props;\n` +
                          `__hover_p.${propName};`;
                      }
                    } else {
                      const htmlTag =
                        parentTag.charAt(0).toUpperCase() + parentTag.slice(1);
                      const elemType = `HTML${htmlTag}Element`;
                      helperLine = `\ndeclare const __hover_el: ${elemType}; __hover_el.${propName};`;
                    }
                    const origText = virtualModel.getValue();
                    try {
                      virtualModel.setValue(origText + helperLine);
                      const fullText = virtualModel.getValue();
                      const propOffset =
                        fullText.lastIndexOf(`.${propName}`) + 1;
                      const info = await client.getQuickInfoAtPosition(
                        virtualScriptUriRef.current,
                        propOffset,
                      );
                      if (info) {
                        const displayParts =
                          info.displayParts?.map((p: any) => p.text).join("") ??
                          "";
                        if (displayParts) {
                          return {
                            contents: [
                              {
                                value:
                                  "```typescript\n" + displayParts + "\n```",
                              },
                            ],
                            range,
                          };
                        }
                      }
                    } finally {
                      virtualModel.setValue(origText);
                    }
                  }
                  // Fallback to static docs
                  const doc = getVueDirectiveDoc(":" + word.word);
                  if (doc) return { contents: [{ value: doc }], range };
                }
                // v-directive
                const vMatch = lineText.match(
                  new RegExp(
                    `(v-${word.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
                  ),
                );
                if (vMatch) {
                  const doc = getVueDirectiveDoc(vMatch[1]!);
                  if (doc) return { contents: [{ value: doc }], range };
                }
                // word itself might be a v-directive name (e.g. hovering on "if" in "v-if")
                const doc = getVueDirectiveDoc(`v-${word.word}`);
                if (doc) {
                  // Only show if context looks like a directive
                  const beforeWord = lineText.slice(0, word.startColumn - 1);
                  if (beforeWord.endsWith("v-")) {
                    return { contents: [{ value: doc }], range };
                  }
                }
              }

              // Svelte directives: on:, bind:, class:, use:, etc.
              if (fw === "svelte") {
                const charBefore =
                  word.startColumn > 1
                    ? (lineText[word.startColumn - 2] ?? "")
                    : "";
                if (charBefore === ":") {
                  // Find the directive prefix before the colon
                  const beforeColon = lineText.slice(0, word.startColumn - 2);
                  const prefixMatch = beforeColon.match(/(\w+)$/);
                  if (prefixMatch) {
                    const doc = getSvelteDirectiveDoc(prefixMatch[1]!);
                    if (doc) return { contents: [{ value: doc }], range };
                  }
                }
                // Svelte block keywords: {#if}, {:else}, {@render}
                const blockMatch = lineText.match(
                  new RegExp(
                    `\\{([#/:@])${word.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
                  ),
                );
                if (blockMatch) {
                  const doc = getSvelteBlockDoc(blockMatch[1]!, word.word);
                  if (doc) return { contents: [{ value: doc }], range };
                }
              }

              // Template expression: try TS lookup for variables inside {{ }} or { }
              // Check if the cursor is inside an expression context
              const beforeCursor = lineText.slice(0, position.column - 1);
              const afterCursor = lineText.slice(position.column - 1);
              const inVueExpr =
                /\{\{[^}]*$/.test(beforeCursor) &&
                /[^{]*\}\}/.test(afterCursor);
              const inSvelteExpr =
                fw === "svelte" && /\{[^#/:@][^}]*$/.test(beforeCursor);
              const inDirectiveExpr = /(?:v-\w+|[@:#]\w+)="[^"]*$/.test(
                beforeCursor,
              );
              if (inVueExpr || inSvelteExpr || inDirectiveExpr) {
                // Try to find this variable in the script block
                const result = await getWorkerClient();
                if (result) {
                  const { client, virtualModel } = result;
                  const scriptText = virtualModel.getValue();
                  // Search for the variable declaration in the script
                  const varPattern = new RegExp(`\\b${word.word}\\b`);
                  const varMatch = varPattern.exec(scriptText);
                  if (varMatch) {
                    const offset = varMatch.index;
                    const info = await client.getQuickInfoAtPosition(
                      virtualScriptUriRef.current,
                      offset,
                    );
                    if (info) {
                      let displayParts =
                        info.displayParts?.map((p: any) => p.text).join("") ??
                        "";
                      const docs =
                        info.documentation
                          ?.map((d: any) => d.text)
                          .join("\n") ?? "";
                      // Vue: unwrap Ref<T> → T for template display
                      if (fw === "vue" && displayParts) {
                        displayParts = displayParts.replace(
                          /\bRef<([^>]+)>/g,
                          "$1",
                        );
                      }
                      if (displayParts || docs) {
                        const contents: any[] = [];
                        if (displayParts) {
                          contents.push({
                            value: "```typescript\n" + displayParts + "\n```",
                          });
                        }
                        if (docs) {
                          contents.push({ value: docs });
                        }
                        return { contents, range };
                      }
                    }
                  }
                }
              }

              // Check if it's an HTML tag
              const tagDoc = await getHtmlTagDoc(tag, fw);
              if (tagDoc) {
                return { contents: [{ value: tagDoc }], range };
              }

              // Check for HTML attributes on the current line
              const attrMatch = lineText.match(
                new RegExp(`\\b(${word.word})\\s*=`),
              );
              if (attrMatch) {
                // Find the parent tag for context-aware attribute docs
                const tagMatch2 = lineText.match(/<(\w+)\s/);
                const parentTag = tagMatch2?.[1]?.toLowerCase();
                const attrDoc = await getHtmlAttrDoc(
                  word.word.toLowerCase(),
                  parentTag,
                );
                if (attrDoc) {
                  return { contents: [{ value: attrDoc }], range };
                }
              }
            }

            // ── Style block: CSS property docs ───────────
            if (section === "style" && word) {
              const lineText = model.getLineContent(position.lineNumber);
              const col = position.column - 1; // 0-indexed
              // Extract full hyphenated word at cursor position
              let start = col,
                end = col;
              while (start > 0 && /[\w-]/.test(lineText[start - 1]!)) start--;
              while (end < lineText.length && /[\w-]/.test(lineText[end]!))
                end++;
              const fullWord = lineText.slice(start, end);
              // Check if this word is a CSS property (before a colon)
              const afterWord = lineText.slice(end).trimStart();
              if (afterWord.startsWith(":")) {
                const prop = fullWord.toLowerCase();
                const doc = await getCssPropertyDoc(prop);
                if (doc) {
                  return {
                    contents: [{ value: doc }],
                    range: {
                      startLineNumber: position.lineNumber,
                      startColumn: start + 1,
                      endLineNumber: position.lineNumber,
                      endColumn: end + 1,
                    },
                  };
                }
              }
              // Check if cursor is on a CSS selector — show specificity
              // A selector is text that appears before a { in style context.
              // Look forward from cursor line to find the opening {
              const totalLines = model.getLineCount();
              let selectorText = "";
              let foundBrace = false;
              for (
                let ln = position.lineNumber;
                ln <= Math.min(position.lineNumber + 5, totalLines);
                ln++
              ) {
                const lt = model.getLineContent(ln);
                const braceIdx = lt.indexOf("{");
                if (braceIdx >= 0) {
                  if (ln === position.lineNumber) {
                    selectorText += lt.slice(0, braceIdx);
                  } else {
                    selectorText += " " + lt.slice(0, braceIdx);
                  }
                  foundBrace = true;
                  break;
                }
                selectorText += (ln === position.lineNumber ? "" : " ") + lt;
              }
              // Also look backwards to capture full multi-line selectors
              if (foundBrace) {
                for (
                  let ln = position.lineNumber - 1;
                  ln >= Math.max(1, position.lineNumber - 5);
                  ln--
                ) {
                  const lt = model.getLineContent(ln).trim();
                  if (
                    !lt ||
                    lt.endsWith("{") ||
                    lt.endsWith("}") ||
                    lt.endsWith(";") ||
                    lt.startsWith("@") ||
                    lt.startsWith("<")
                  )
                    break;
                  selectorText = lt + " " + selectorText;
                }
              }
              const selector = selectorText
                .trim()
                .replace(/<\/?style[^>]*>/g, "")
                .trim();
              if (
                foundBrace &&
                selector &&
                /^[\w.#:\[\]>+~*\s,\-()]+$/.test(selector)
              ) {
                // Calculate basic specificity
                const ids = (selector.match(/#[\w-]+/g) || []).length;
                const classCount = (selector.match(/\.[\w-]+/g) || []).length;
                const attrCount = (selector.match(/\[[\w-]/g) || []).length;
                const pseudoClassCount = (selector.match(/:(?!:)[\w-]+/g) || [])
                  .length;
                const pseudoElemCount = (selector.match(/::[\w-]+/g) || [])
                  .length;
                const classes = classCount + attrCount + pseudoClassCount;
                const elems =
                  (selector.match(/(?:^|[\s>+~,])[\w][\w-]*/g) || []).length +
                  pseudoElemCount;
                return {
                  contents: [
                    {
                      value: `\`${selector}\`\n\n[Selector Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity): (${ids}, ${classes}, ${elems})`,
                    },
                  ],
                  range,
                };
              }
            }

            return null;
          },
        });

        // ── Completion provider (script + template + style) ──
        m.languages.registerCompletionItemProvider(langId, {
          triggerCharacters: [".", "'", '"', "/", "@", "<", ":"],
          provideCompletionItems: async (model: any, position: any) => {
            const sfcContent = model.getValue();
            const section = getSfcSection(
              sfcContent,
              position.lineNumber,
              langId,
            );
            const word = model.getWordUntilPosition(position);
            const range = {
              startLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endLineNumber: position.lineNumber,
              endColumn: word.endColumn,
            };

            // ── Script: proxy to TS worker
            if (section === "script") {
              const scriptLine = sfcToScriptLine(
                sfcContent,
                position.lineNumber,
              );
              if (scriptLine === null) return { suggestions: [] };

              const result = await getWorkerClient();
              if (!result) return { suggestions: [] };
              const { client, virtualModel } = result;

              const offset = virtualModel.getOffsetAt({
                lineNumber: scriptLine,
                column: position.column,
              });
              const completions = await client.getCompletionsAtPosition(
                virtualScriptUriRef.current,
                offset,
                {},
              );
              if (!completions) return { suggestions: [] };

              const kindMap: Record<string, number> = {
                keyword: 17,
                function: 1,
                method: 0,
                property: 9,
                variable: 4,
                class: 5,
                interface: 7,
                module: 8,
                enum: 15,
                constant: 14,
                type: 7,
              };

              return {
                suggestions: completions.entries.map((entry: any) => ({
                  label: entry.name,
                  kind: kindMap[entry.kind] ?? 9,
                  insertText: entry.name,
                  range,
                  sortText: entry.sortText,
                })),
              };
            }

            // ── Template: HTML element suggestions
            if (section === "template") {
              const lineText = model.getLineContent(position.lineNumber);
              const textBefore = lineText.slice(0, position.column - 1);

              // After < suggest elements
              if (textBefore.endsWith("<") || /^<\w*$/.test(word.word)) {
                const tagNames = await getHtmlTagNames();
                const suggestions = await Promise.all(
                  tagNames.map(async (tag) => ({
                    label: tag,
                    kind: 9, // Property
                    insertText: tag,
                    range,
                    detail: "HTML Element",
                    documentation: await getHtmlTagSummary(tag),
                  })),
                );
                return { suggestions };
              }
              return { suggestions: [] };
            }

            // ── Style: CSS property suggestions
            if (section === "style") {
              const propNames = await getCssPropertyNames();
              const suggestions = await Promise.all(
                propNames.map(async (prop) => ({
                  label: prop,
                  kind: 9,
                  insertText: `${prop}: `,
                  range,
                  detail: "CSS Property",
                  documentation: await getCssPropertySummary(prop),
                })),
              );
              return { suggestions };
            }

            return { suggestions: [] };
          },
        });

        // ── Definition provider (ctrl+click) ─────────────────
        m.languages.registerDefinitionProvider(langId, {
          provideDefinition: async (model: any, position: any) => {
            const sfcContent = model.getValue();
            const word = model.getWordAtPosition(position);

            // Template section: check if clicking a component name
            const scriptLine = sfcToScriptLine(sfcContent, position.lineNumber);
            if (scriptLine === null) {
              // Outside script — check for component name in template
              if (word && /^[A-Z]/.test(word.word)) {
                const block = getScriptBlock(sfcContent);
                if (block) {
                  const importRe = new RegExp(
                    `import\\s+${word.word}\\s+from\\s+['"]([^'"]+\\.(?:svelte|vue))['"]`,
                  );
                  const importMatch = importRe.exec(block.trimmed);
                  if (importMatch) {
                    const importPath = importMatch[1]!;
                    const currentPath = model.uri.path;
                    const currentDir = currentPath.substring(
                      0,
                      currentPath.lastIndexOf("/"),
                    );
                    const parts = currentDir.split("/");
                    for (const seg of importPath.split("/")) {
                      if (seg === "..") parts.pop();
                      else if (seg !== ".") parts.push(seg);
                    }
                    const resolvedPath = parts.join("/");
                    return [
                      {
                        uri: m.Uri.parse(`file://${resolvedPath}`),
                        range: {
                          startLineNumber: 1,
                          startColumn: 1,
                          endLineNumber: 1,
                          endColumn: 1,
                        },
                      },
                    ];
                  }
                }
              }
              return null;
            }

            const result = await getWorkerClient();
            if (!result) return null;
            const { client, virtualModel } = result;

            const offset = virtualModel.getOffsetAt({
              lineNumber: scriptLine,
              column: position.column,
            });

            // Check if clicking an imported SFC component — return a
            // definition pointing to a URI that openCodeEditor will
            // intercept and open in a new tab (not navigate immediately).
            if (word) {
              const scriptText = virtualModel.getValue();
              const importRe = new RegExp(
                `import\\s+${word.word}\\s+from\\s+['"]([^'"]+\\.(?:svelte|vue))['"]`,
              );
              const importMatch = importRe.exec(scriptText);
              if (importMatch) {
                const importPath = importMatch[1]!;
                const currentPath = model.uri.path;
                const currentDir = currentPath.substring(
                  0,
                  currentPath.lastIndexOf("/"),
                );
                const parts = currentDir.split("/");
                for (const seg of importPath.split("/")) {
                  if (seg === "..") parts.pop();
                  else if (seg !== ".") parts.push(seg);
                }
                const resolvedPath = parts.join("/");
                // Return a definition location — openCodeEditor will
                // handle the actual navigation on click
                return [
                  {
                    uri: m.Uri.parse(`file://${resolvedPath}`),
                    range: {
                      startLineNumber: 1,
                      startColumn: 1,
                      endLineNumber: 1,
                      endColumn: 1,
                    },
                  },
                ];
              }
            }

            const defs = await client.getDefinitionAtPosition(
              virtualScriptUriRef.current,
              offset,
            );
            if (!defs || defs.length === 0) return null;

            return defs
              .map((def: any) => {
                // Skip definitions pointing to node_modules stubs
                if (def.fileName.includes("/node_modules/")) {
                  return null;
                }

                const defUri = m.Uri.parse(def.fileName);
                const defModel = m.editor.getModel(defUri);
                if (!defModel) {
                  return {
                    uri: defUri,
                    range: {
                      startLineNumber: 1,
                      startColumn: 1,
                      endLineNumber: 1,
                      endColumn: 1,
                    },
                  };
                }

                const startPos = defModel.getPositionAt(def.textSpan.start);
                const endPos = defModel.getPositionAt(
                  def.textSpan.start + def.textSpan.length,
                );

                // If definition is in the virtual script block,
                // map back to SFC coordinates
                if (def.fileName === virtualScriptUriRef.current) {
                  return {
                    uri: model.uri,
                    range: {
                      startLineNumber: scriptToSfcLine(
                        sfcContent,
                        startPos.lineNumber,
                      ),
                      startColumn: startPos.column,
                      endLineNumber: scriptToSfcLine(
                        sfcContent,
                        endPos.lineNumber,
                      ),
                      endColumn: endPos.column,
                    },
                  };
                }

                return {
                  uri: defUri,
                  range: {
                    startLineNumber: startPos.lineNumber,
                    startColumn: startPos.column,
                    endLineNumber: endPos.lineNumber,
                    endColumn: endPos.column,
                  },
                };
              })
              .filter(Boolean);
          },
        });

        // ── Signature help provider ──────────────────────────
        m.languages.registerSignatureHelpProvider(langId, {
          signatureHelpTriggerCharacters: ["(", ","],
          provideSignatureHelp: async (model: any, position: any) => {
            const sfcContent = model.getValue();
            const scriptLine = sfcToScriptLine(sfcContent, position.lineNumber);
            if (scriptLine === null) return null;

            const result = await getWorkerClient();
            if (!result) return null;
            const { client, virtualModel } = result;

            const offset = virtualModel.getOffsetAt({
              lineNumber: scriptLine,
              column: position.column,
            });
            const help = await client.getSignatureHelpItems(
              virtualScriptUriRef.current,
              offset,
              {},
            );
            if (!help) return null;

            return {
              value: {
                signatures: help.items.map((item: any) => ({
                  label: [
                    ...item.prefixDisplayParts,
                    ...item.parameters.flatMap((p: any, i: number) => [
                      ...(i > 0 ? item.separatorDisplayParts : []),
                      ...p.displayParts,
                    ]),
                    ...item.suffixDisplayParts,
                  ]
                    .map((p: any) => p.text)
                    .join(""),
                  parameters: item.parameters.map((p: any) => ({
                    label: p.displayParts.map((d: any) => d.text).join(""),
                    documentation:
                      p.documentation?.map((d: any) => d.text).join("\n") ?? "",
                  })),
                })),
                activeSignature: help.selectedItemIndex,
                activeParameter: help.argumentIndex,
              },
              dispose: () => {},
            };
          },
        });
      }

      // Link provider: underline full import path on ctrl+hover
      for (const langId of ["typescript", "javascript", "svelte", "vue"]) {
        m.languages.registerLinkProvider(langId, {
          provideLinks: (model: any) => {
            const links: any[] = [];
            const text = model.getValue();
            const importRe = /import\s+[\s\S]*?from\s+(['"])([^'"]+)\1/g;
            let match: RegExpExecArray | null;
            while ((match = importRe.exec(text)) !== null) {
              const specifier = match[2]!;
              if (!specifier.startsWith(".")) continue;
              const pathStart = match.index + match[0].lastIndexOf(specifier);
              const startPos = model.getPositionAt(pathStart);
              const endPos = model.getPositionAt(pathStart + specifier.length);
              links.push({
                range: {
                  startLineNumber: startPos.lineNumber,
                  startColumn: startPos.column,
                  endLineNumber: endPos.lineNumber,
                  endColumn: endPos.column,
                },
              });
            }
            return { links };
          },
        });
      }
    },
    [sfcToScriptLine, scriptToSfcLine, getSfcSection],
  );

  // ── TypeScript compiler ────────────────────────────────────────
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
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    });

    tsDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    tsDefaults.setEagerModelSync(true);
  }, []);

  // ── Extra models & type definitions ────────────────────────────
  const loadExtraModels = useCallback(
    (m: any) => {
      const tsDefaults = m.languages.typescript?.typescriptDefaults;
      const nextUris = new Set<string>();

      // Helper: add or update an extra lib + model at a URI
      const upsert = (uri: string, content: string) => {
        nextUris.add(uri);
        // Extra lib
        const oldLib = extraLibsRef.current.get(uri);
        if (oldLib) oldLib.dispose();
        if (tsDefaults) {
          extraLibsRef.current.set(uri, tsDefaults.addExtraLib(content, uri));
        }
        // Model
        const existing = m.editor.getModel(m.Uri.parse(uri));
        if (existing) {
          if (existing.getValue() !== content) existing.setValue(content);
        } else {
          extraModelsRef.current.set(
            uri,
            m.editor.createModel(content, "typescript", m.Uri.parse(uri)),
          );
        }
      };

      if (types) {
        for (const [path, content] of Object.entries(types)) {
          upsert(`file:///node_modules/${path}`, content);
        }
      }

      if (deps) {
        for (const [resolvedPath, content] of Object.entries(deps)) {
          const normalized = resolvedPath.startsWith("/")
            ? resolvedPath
            : `/${resolvedPath}`;
          const uri = `file://${normalized}`;
          const isSvelte = normalized.endsWith(".svelte");
          const isVue = normalized.endsWith(".vue");

          if (isSvelte || isVue) {
            const scriptMatch = content.match(
              /<script[^>]*>([\s\S]*?)<\/script>/,
            );
            const scriptBlock = scriptMatch?.[1]?.trim() ?? "";

            // Extract props type name and body from script block
            let propsTypeName = "";
            let propsTypeBody = "{}";
            if (isSvelte) {
              // Match: type CounterProps = { ... } or interface CounterProps { ... }
              const propsTypeMatch = scriptBlock.match(
                /(?:type|interface)\s+(\w*Props)\s*=?\s*(\{[\s\S]*?\})/,
              );
              if (propsTypeMatch) {
                propsTypeName = propsTypeMatch[1]!;
                propsTypeBody = propsTypeMatch[2]!;
              }
            } else {
              const definePropsMatch = scriptBlock.match(
                /defineProps\s*<\s*(\{[\s\S]*?\})\s*>\s*\(/,
              );
              if (definePropsMatch) {
                propsTypeBody = definePropsMatch[1]!;
              } else {
                const namedPropsMatch = scriptBlock.match(
                  /defineProps\s*<\s*(\w+)\s*>\s*\(/,
                );
                if (namedPropsMatch) {
                  propsTypeName = namedPropsMatch[1]!;
                  const typeDefMatch = scriptBlock.match(
                    new RegExp(
                      `(?:type|interface)\\s+${namedPropsMatch[1]}\\s*=?\\s*(\\{[\\s\\S]*?\\})`,
                    ),
                  );
                  if (typeDefMatch) {
                    propsTypeBody = typeDefMatch[1]!;
                  }
                }
              }
            }

            // TS doesn't resolve .svelte/.vue imports in module resolution.
            // Register a .tsx file at the same base path so TS finds it
            // when the virtual script strips .svelte/.vue from imports.
            let tsContent: string;
            if (isSvelte) {
              // Use the original props type name (e.g. CounterProps)
              // and export a type that shows the component shape on hover
              const pName = propsTypeName || "Props";
              tsContent =
                `export interface ${pName} ${propsTypeBody}\n` +
                `declare const __component: {\n` +
                `  $on?(type: string, callback: (e: any) => void): () => void;\n` +
                `  $set?(props: Partial<${pName}>): void;\n` +
                `};\n` +
                `export default __component;\n`;
            } else {
              tsContent =
                `declare const __component: { new(props: ${propsTypeBody}): any; $props: ${propsTypeBody} };\n` +
                `export default __component;\n`;
            }

            // Register at .tsx path (replacing .svelte/.vue extension)
            const tsxUri = uri.replace(/\.(svelte|vue)$/, ".tsx");
            upsert(tsxUri, tsContent);
          } else {
            upsert(uri, content);
          }
        }
      }

      // Dispose libs/models that are no longer needed
      for (const [uri, lib] of extraLibsRef.current) {
        if (!nextUris.has(uri)) {
          lib.dispose();
          extraLibsRef.current.delete(uri);
        }
      }
      for (const [uri, model] of extraModelsRef.current) {
        if (!nextUris.has(uri)) {
          model.dispose();
          extraModelsRef.current.delete(uri);
        }
      }
    },
    [types, deps],
  );

  // ── Script-block extraction for Svelte/Vue ─────────────────────
  const updateScriptBlockModel = useCallback(
    (m: any, content: string, fw?: string) => {
      if (fw !== "svelte" && fw !== "vue") {
        if (scriptBlockModelRef.current) {
          scriptBlockModelRef.current.dispose();
          scriptBlockModelRef.current = null;
        }
        if (scriptBlockLibRef.current) {
          scriptBlockLibRef.current.dispose();
          scriptBlockLibRef.current = null;
        }
        return;
      }

      const block = getScriptBlock(content);
      if (!block) return;

      // Compute virtual script URI in the same directory as the SFC
      // so that relative imports resolve correctly
      const newVirtualUri = getVirtualScriptUri(filePathRef.current);
      const oldVirtualUri = virtualScriptUriRef.current;

      // If the URI changed (file switched), dispose old model/lib
      if (oldVirtualUri !== newVirtualUri) {
        const oldModel = m.editor.getModel(m.Uri.parse(oldVirtualUri));
        if (oldModel) oldModel.dispose();
        if (scriptBlockLibRef.current) {
          scriptBlockLibRef.current.dispose();
          scriptBlockLibRef.current = null;
        }
        scriptBlockModelRef.current = null;
        virtualScriptUriRef.current = newVirtualUri;
      }

      // Strip .svelte/.vue extensions from imports so TS module resolution
      // finds our synthetic type files registered by loadExtraModels
      // (TS resolves extensionless imports by trying .ts, .tsx, .d.ts etc.)
      const rewritten = block.trimmed.replace(
        /(from\s+['"])([^'"]+)\.(svelte|vue)(['"])/g,
        "$1$2$4",
      );

      const tsDefaults = m.languages.typescript?.typescriptDefaults;
      const parsedUri = m.Uri.parse(newVirtualUri);

      if (scriptBlockLibRef.current) {
        scriptBlockLibRef.current.dispose();
        scriptBlockLibRef.current = null;
      }

      const existing = m.editor.getModel(parsedUri);
      if (existing) {
        existing.setValue(rewritten);
      } else {
        scriptBlockModelRef.current = m.editor.createModel(
          rewritten,
          "typescript",
          parsedUri,
        );
      }

      if (tsDefaults) {
        scriptBlockLibRef.current = tsDefaults.addExtraLib(
          rewritten,
          newVirtualUri,
        );
      }
    },
    [getScriptBlock],
  );

  // ── Diagnostic markers for Svelte/Vue ──────────────────────────
  // Pull TS diagnostics from the virtual script model and show them
  // as markers on the SFC editor (mapped back to SFC line numbers).
  const updateDiagnosticMarkers = useCallback(
    async (m: any) => {
      const editor = editorRef.current;
      const model = modelRef.current;
      if (!editor || !model) return;

      const fw = frameworkRef.current;
      if (fw !== "svelte" && fw !== "vue") return;

      const virtualUri = m.Uri.parse(virtualScriptUriRef.current);
      const virtualModel = m.editor.getModel(virtualUri);
      if (!virtualModel) return;

      const getWorker = m.languages.typescript?.getTypeScriptWorker;
      if (!getWorker) return;

      try {
        const worker = await getWorker();
        const client = await worker(virtualUri);
        const [semantic, syntactic] = await Promise.all([
          client.getSemanticDiagnostics(virtualScriptUriRef.current),
          client.getSyntacticDiagnostics(virtualScriptUriRef.current),
        ]);

        const sfcContent = model.getValue();
        const allDiags = [...(syntactic ?? []), ...(semantic ?? [])];

        const markers = allDiags.map((d: any) => {
          const startPos = virtualModel.getPositionAt(d.start ?? 0);
          const endPos = virtualModel.getPositionAt(
            (d.start ?? 0) + (d.length ?? 1),
          );
          const sfcStartLine = scriptToSfcLine(sfcContent, startPos.lineNumber);
          const sfcEndLine = scriptToSfcLine(sfcContent, endPos.lineNumber);

          const message =
            typeof d.messageText === "string"
              ? d.messageText
              : (d.messageText?.messageText ?? "Error");

          return {
            severity: d.category === 1 ? 8 : d.category === 0 ? 4 : 2,
            startLineNumber: sfcStartLine,
            startColumn: startPos.column,
            endLineNumber: sfcEndLine,
            endColumn: endPos.column,
            message,
            code: d.code?.toString(),
            source: "ts",
          };
        });

        m.editor.setModelMarkers(model, "typescript", markers);
      } catch {
        // Worker not ready yet — skip
      }
    },
    [scriptToSfcLine],
  );

  // ── Bind content listener to the current model ─────────────────
  const bindContentListener = useCallback(
    (m: any, model: any) => {
      if (contentListenerRef.current) {
        contentListenerRef.current.dispose();
      }
      contentListenerRef.current = model.onDidChangeContent(() => {
        const val = model.getValue();
        onChangeRef.current?.(val);

        const fw = frameworkRef.current;
        if (fw === "svelte" || fw === "vue") {
          updateScriptBlockModel(m, val, fw);
          // Debounced diagnostic update
          clearTimeout(diagnosticIntervalRef.current);
          diagnosticIntervalRef.current = setTimeout(
            () => updateDiagnosticMarkers(m),
            500,
          );
        }
      });
    },
    [updateScriptBlockModel, updateDiagnosticMarkers],
  );

  // ── Model swapping (for tabs) ──────────────────────────────────
  const swapModel = useCallback(
    (m: any, newValue: string, newPath?: string, newFramework?: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      const currentModel = modelRef.current;
      const currentUri = currentModel?.uri?.toString();

      const newUri = buildModelUri(m, newPath);
      const newUriStr = newUri.toString();

      // Same model — just update value if needed
      if (currentUri === newUriStr) {
        if (currentModel && currentModel.getValue() !== newValue) {
          currentModel.setValue(newValue);
        }
        return;
      }

      // Save view state for current model
      if (currentModel) {
        viewStatesRef.current.set(currentUri!, editor.saveViewState());
      }

      // Get or create new model
      const lang = newFramework
        ? getLanguageId(newFramework)
        : getLangFromPath(newPath ?? "");
      let newModel = m.editor.getModel(newUri);
      if (newModel) {
        if (newModel.getValue() !== newValue) {
          newModel.setValue(newValue);
        }
        if (newModel.getLanguageId() !== lang) {
          m.editor.setModelLanguage(newModel, lang);
        }
      } else {
        newModel = m.editor.createModel(newValue, lang, newUri);
      }

      editor.setModel(newModel);
      modelRef.current = newModel;

      // Restore view state if we had one
      const savedState = viewStatesRef.current.get(newUriStr);
      if (savedState) {
        editor.restoreViewState(savedState);
      }

      // Rebind the content change listener to the new model
      bindContentListener(m, newModel);

      // Update script block for SFC files
      const fw =
        newFramework ??
        (newPath?.endsWith(".svelte")
          ? "svelte"
          : newPath?.endsWith(".vue")
            ? "vue"
            : undefined);
      if (fw === "svelte" || fw === "vue") {
        updateScriptBlockModel(m, newValue, fw);
        setTimeout(() => updateDiagnosticMarkers(m), 300);
      } else {
        // For TypeScript models (React, etc.), clear stale markers from
        // previous sessions — the TS worker will recompute them.
        m.editor.setModelMarkers(newModel, "typescript", []);
      }
    },
    [
      buildModelUri,
      bindContentListener,
      updateScriptBlockModel,
      updateDiagnosticMarkers,
    ],
  );

  // ── Initialisation ─────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return;

    (window as any).MonacoEnvironment = {
      getWorkerUrl(_moduleId: string, _label: string) {
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(
          `self.MonacoEnvironment = { baseUrl: '${CDN_BASE}' };` +
            `importScripts('${CDN_URL}/base/worker/workerMain.js');`,
        )}`;
      },
    };

    const loaderScript = document.getElementById("monaco-loader");
    const initMonaco = () => {
      (window as any).require.config({ paths: { vs: CDN_URL } });
      (window as any).require(["vs/editor/editor.main"], (m: any) => {
        monacoRef.current = m;

        defineTheme(m);
        registerLanguages(m);
        configureTypescript(m);

        const lang = getLanguageId(frameworkRef.current);
        const modelUri = buildModelUri(m, filePathRef.current);

        const stale = m.editor.getModel(modelUri);
        if (stale) stale.dispose();

        const model = m.editor.createModel(valueRef.current, lang, modelUri);
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
          gotoLocation: {
            multiple: "goto",
            multipleDefinitions: "goto",
          },
          fixedOverflowWidgets: true,
          hover: {
            above: false,
          },
          "semanticHighlighting.enabled": true,
        });

        editorRef.current = editor;

        // Bind content listener
        bindContentListener(m, model);

        editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.KeyS, () => {
          const currentModel = modelRef.current;
          if (currentModel) {
            onSaveRef.current?.(currentModel.getValue());
          }
        });

        // Ctrl+click go-to-definition override
        const editorService = (editor as any)._codeEditorService;
        if (editorService) {
          const openEditorBase =
            editorService.openCodeEditor.bind(editorService);
          editorService.openCodeEditor = async (input: any, source: any) => {
            const result = await openEditorBase(input, source);
            if (result) return result;

            const targetUri = input.resource?.toString() ?? "";
            const currentUri = modelRef.current?.uri?.toString();

            if (
              targetUri &&
              targetUri !== currentUri &&
              !targetUri.includes("/node_modules/") &&
              onNavigateRef.current
            ) {
              const filePath = targetUri.replace(/^file:\/\//, "");
              onNavigateRef.current(filePath);
              return editor;
            }

            const targetModel = m.editor.getModel(input.resource);
            if (targetModel && targetModel !== modelRef.current) {
              editor.setModel(targetModel);
              modelRef.current = targetModel;
              bindContentListener(m, targetModel);
              if (input.options?.selection) {
                const sel = input.options.selection;
                if (sel.endLineNumber != null && sel.endColumn != null) {
                  editor.setSelection(sel);
                  editor.revealRangeInCenter(sel);
                } else {
                  editor.setPosition({
                    lineNumber: sel.startLineNumber,
                    column: sel.startColumn,
                  });
                  editor.revealPositionInCenter({
                    lineNumber: sel.startLineNumber,
                    column: sel.startColumn,
                  });
                }
              }
              return editor;
            }

            return result;
          };
        }

        updateScriptBlockModel(m, valueRef.current, frameworkRef.current);
        loadExtraModels(m);

        // Initial diagnostic markers for SFC files
        if (
          frameworkRef.current === "svelte" ||
          frameworkRef.current === "vue"
        ) {
          setTimeout(() => updateDiagnosticMarkers(m), 1000);
        }

        isInitializedRef.current = true;
      });
    };

    if (loaderScript) {
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
      clearTimeout(diagnosticIntervalRef.current);
      if (contentListenerRef.current) {
        contentListenerRef.current.dispose();
        contentListenerRef.current = null;
      }
      if (scriptBlockModelRef.current) {
        scriptBlockModelRef.current.dispose();
        scriptBlockModelRef.current = null;
      }
      if (scriptBlockLibRef.current) {
        scriptBlockLibRef.current.dispose();
        scriptBlockLibRef.current = null;
      }
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
      if (modelRef.current) {
        modelRef.current.dispose();
        modelRef.current = null;
      }
      for (const model of extraModelsRef.current.values()) model.dispose();
      extraModelsRef.current.clear();
      for (const d of extraLibsRef.current.values()) d.dispose();
      extraLibsRef.current.clear();
      isInitializedRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── React to prop changes ─────────────────────────────────────

  // filePath or value changed → swap model (tab switch)
  useEffect(() => {
    if (monacoRef.current && isInitializedRef.current) {
      swapModel(monacoRef.current, value, filePath, framework);
    }
  }, [filePath, value, framework, swapModel]);

  useEffect(() => {
    if (monacoRef.current && isInitializedRef.current) {
      loadExtraModels(monacoRef.current);
      // After reloading extra libs, force TS worker to re-validate
      // the current model. Without this, switching pages and back
      // leaves stale "Cannot find module" errors because the model
      // was set before the deps were re-added.
      const currentModel = modelRef.current;
      if (currentModel) {
        const fw = frameworkRef.current;
        if (fw === "svelte" || fw === "vue") {
          setTimeout(() => updateDiagnosticMarkers(monacoRef.current!), 300);
        } else {
          // For non-SFC (React/TS): touch model to force TS re-analysis
          setTimeout(() => {
            const val = currentModel.getValue();
            currentModel.setValue(val + " ");
            currentModel.setValue(val);
          }, 100);
        }
      }
    }
  }, [types, deps, loadExtraModels, updateDiagnosticMarkers]);

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
