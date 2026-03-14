/**
 * Hover documentation sourced from VSCode's vscode-custom-data repository.
 * HTML: browsers.html-data.json, CSS: browsers.css-data.json
 * Vue/Svelte SFC block overrides from their respective language tools.
 */

const VSCODE_DATA_BASE =
  "https://raw.githubusercontent.com/microsoft/vscode-custom-data/main/web-data/data";

// ── Cached data ─────────────────────────────────────────────────────
type HtmlTag = {
  name: string;
  description: { kind: string; value: string } | string;
  attributes?: Array<{
    name: string;
    description?: { kind: string; value: string } | string;
  }>;
  references?: Array<{ name: string; url: string }>;
};

type CssProp = {
  name: string;
  description?: string;
  syntax?: string;
  references?: Array<{ name: string; url: string }>;
};

let htmlTagMap: Map<string, HtmlTag> | null = null;
let htmlAttrMap: Map<string, Map<string, string>> | null = null;
let cssPropMap: Map<string, CssProp> | null = null;
let htmlPromise: Promise<void> | null = null;
let cssPromise: Promise<void> | null = null;

async function ensureHtmlData(): Promise<void> {
  if (htmlTagMap) return;
  if (htmlPromise) return htmlPromise;
  htmlPromise = (async () => {
    try {
      const res = await fetch(`${VSCODE_DATA_BASE}/browsers.html-data.json`);
      const data = await res.json();
      htmlTagMap = new Map();
      htmlAttrMap = new Map();
      for (const tag of data.tags ?? []) {
        htmlTagMap.set(tag.name, tag);
        if (tag.attributes?.length) {
          const attrs = new Map<string, string>();
          for (const attr of tag.attributes) {
            const desc =
              typeof attr.description === "string"
                ? attr.description
                : (attr.description?.value ?? "");
            if (desc) attrs.set(attr.name, desc);
          }
          htmlAttrMap.set(tag.name, attrs);
        }
      }
      // Also store global attributes from data.globalAttributes
      if (data.globalAttributes?.length) {
        const globalAttrs = new Map<string, string>();
        for (const attr of data.globalAttributes) {
          const desc =
            typeof attr.description === "string"
              ? attr.description
              : (attr.description?.value ?? "");
          if (desc) globalAttrs.set(attr.name, desc);
        }
        htmlAttrMap.set("__global__", globalAttrs);
      }
    } catch {
      // Fallback: empty maps
      htmlTagMap = new Map();
      htmlAttrMap = new Map();
    }
  })();
  return htmlPromise;
}

async function ensureCssData(): Promise<void> {
  if (cssPropMap) return;
  if (cssPromise) return cssPromise;
  cssPromise = (async () => {
    try {
      const res = await fetch(`${VSCODE_DATA_BASE}/browsers.css-data.json`);
      const data = await res.json();
      cssPropMap = new Map();
      for (const prop of data.properties ?? []) {
        cssPropMap.set(prop.name, prop);
      }
    } catch {
      cssPropMap = new Map();
    }
  })();
  return cssPromise;
}

// ── Vue SFC block overrides ─────────────────────────────────────────
// Source: Volar / vuejs/language-tools SFC specification
const VUE_SFC_BLOCKS: Record<string, string> = {
  template: [
    "Each `*.vue` file can contain at most one top-level `<template>` block.",
    "",
    "Contents will be extracted and passed on to `@vue/compiler-dom`,",
    "pre-compiled into JavaScript render functions, and attached to the",
    "exported component as its `render` option.",
  ].join("\n"),
  script: [
    "Each `*.vue` file can contain at most one `<script>` block (excluding `<script setup>`).",
    "",
    "The script is executed as an ES Module.",
    "",
    "The **default export** should be a Vue component options object,",
    "either as a plain object or as the return value of `defineComponent`.",
  ].join("\n"),
  "script setup": [
    "Each `*.vue` file can contain at most one `<script setup>` block.",
    "",
    "The script is pre-processed and used as the component's `setup()` function,",
    "meaning it will be executed **for each instance** of the component.",
    "Top-level bindings in `<script setup>` are automatically exposed to the template.",
  ].join("\n"),
  style: [
    "A single `*.vue` file can contain multiple `<style>` tags.",
    "",
    "A `<style>` tag can have `scoped` or `module` attributes to",
    "encapsulate the styles to the current component.",
    "Multiple `<style>` tags with different encapsulation modes can be",
    "mixed in the same component.",
  ].join("\n"),
};

// ── Svelte SFC block overrides ──────────────────────────────────────
// Source: sveltejs/language-tools
const SVELTE_SFC_BLOCKS: Record<string, string> = {
  script: [
    'A `<script>` block contains JavaScript (or TypeScript with `lang="ts"`) that runs when a component instance is created.',
    "",
    "Variables declared (or imported) at the top level can be referenced in the component's markup.",
    "",
    "In Svelte 5, use **runes** (`$state`, `$derived`, `$effect`) for reactivity.",
  ].join("\n"),
  style: [
    "CSS inside a `<style>` block will be scoped to that component.",
    "",
    "This works by adding a unique class to affected elements,",
    "based on a hash of the component styles.",
    "",
    "Use `:global(...)` to apply styles globally.",
  ].join("\n"),
};

// ── Vue directives ──────────────────────────────────────────────────
// Source: vuejs.org documentation
const VUE_DIRECTIVES: Record<string, string> = {
  "v-if":
    "Conditionally render an element or a template fragment based on the truthy-ness of the expression value.",
  "v-else-if": 'Denote the "else if block" for `v-if`. Can be chained.',
  "v-else": 'Denote the "else block" for `v-if` / `v-else-if`.',
  "v-for":
    "Render the element or template block multiple times based on the source data.\n\nExpects: `Array | Object | number | string | Iterable`",
  "v-on":
    "Attach an event listener to the element.\n\nShorthand: `@`\n\nExpects: `Function | Inline Statement | Object (without argument)`\n\nModifiers: `.stop`, `.prevent`, `.capture`, `.self`, `.once`, `.passive`",
  "v-bind":
    "Dynamically bind one or more attributes, or a component prop to an expression.\n\nShorthand: `:` or `.` (when using `.prop` modifier)",
  "v-model":
    "Create a two-way binding on a form input element or a component.\n\nLimited to: `<input>`, `<select>`, `<textarea>`, components",
  "v-slot":
    "Denote named slots or scoped slots that expect to receive props.\n\nShorthand: `#`",
  "v-show":
    "Toggle the element's visibility based on the truthy-ness of the expression value.\n\nDiffers from `v-if` in that `v-show` toggles the CSS `display` property.",
  "v-html":
    "Update the element's `innerHTML`.\n\n**Note:** Contents are inserted as plain HTML — they will not be compiled as Vue templates.",
  "v-text": "Update the element's text content.",
  "v-pre":
    "Skip compilation for this element and all its children. You can use this for displaying raw mustache tags.",
  "v-once":
    "Render the element and component once only, and skip future updates.",
  "v-memo":
    "Memoize a sub-tree of the template. Can be used on both elements and components.",
  "v-cloak":
    "Used to hide un-compiled template until it is ready.\n\nTypically used with a CSS rule like `[v-cloak] { display: none }`.",
  // Shorthands
  "@click": "Listen for the `click` event.\n\nShorthand for `v-on:click`",
  "@input": "Listen for the `input` event.\n\nShorthand for `v-on:input`",
  "@submit": "Listen for the `submit` event.\n\nShorthand for `v-on:submit`",
  "@change": "Listen for the `change` event.\n\nShorthand for `v-on:change`",
  "@keydown": "Listen for the `keydown` event.\n\nShorthand for `v-on:keydown`",
  "@keyup": "Listen for the `keyup` event.\n\nShorthand for `v-on:keyup`",
  "@focus": "Listen for the `focus` event.\n\nShorthand for `v-on:focus`",
  "@blur": "Listen for the `blur` event.\n\nShorthand for `v-on:blur`",
  "@mouseover":
    "Listen for the `mouseover` event.\n\nShorthand for `v-on:mouseover`",
  "@mouseenter":
    "Listen for the `mouseenter` event.\n\nShorthand for `v-on:mouseenter`",
  "@mouseleave":
    "Listen for the `mouseleave` event.\n\nShorthand for `v-on:mouseleave`",
  "@pointerenter":
    "Listen for the `pointerenter` event.\n\nShorthand for `v-on:pointerenter`",
  "@pointerleave":
    "Listen for the `pointerleave` event.\n\nShorthand for `v-on:pointerleave`",
};

// Svelte block keywords ({#if}, {#each}, {#await}, etc.)
// Source: https://svelte.dev/docs/svelte
const SVELTE_BLOCKS: Record<
  string,
  { syntax: string; description: string; url: string }
> = {
  if: {
    syntax: "{#if expression}...{/if}",
    description:
      "Content that is conditionally rendered can be wrapped in an if block.\n\n```svelte\n{#if expression}...{/if}\n{#if expression}...{:else if expression}...{/if}\n{#if expression}...{:else}...{/if}\n```",
    url: "https://svelte.dev/docs/svelte/if",
  },
  each: {
    syntax: "{#each expression as name}...{/each}",
    description:
      "Iterating over lists of values can be done with an each block.\n\n```svelte\n{#each expression as name}...{/each}\n{#each expression as name, index}...{/each}\n{#each expression as name (key)}...{/each}\n{#each expression as name, index (key)}...{/each}\n```",
    url: "https://svelte.dev/docs/svelte/each",
  },
  await: {
    syntax: "{#await expression}...{:then name}...{:catch name}...{/await}",
    description:
      "Await blocks allow you to branch on the three possible states of a Promise — pending, fulfilled or rejected.\n\n```svelte\n{#await expression}...{:then name}...{:catch name}...{/await}\n{#await expression then name}...{/await}\n{#await expression catch name}...{/await}\n```",
    url: "https://svelte.dev/docs/svelte/await",
  },
  snippet: {
    syntax: "{#snippet name()}...{/snippet}",
    description:
      "Snippets allow you to create reusable chunks of markup inside your components.\n\n```svelte\n{#snippet name(param1, param2)}...{/snippet}\n```\n\nSnippets can be rendered with `{@render name(args)}`.",
    url: "https://svelte.dev/docs/svelte/snippet",
  },
  key: {
    syntax: "{#key expression}...{/key}",
    description:
      "Key blocks destroy and recreate their contents when the value of an expression changes. When used around components, this will cause them to be reinstantiated and reinitialised.",
    url: "https://svelte.dev/docs/svelte/key",
  },
  else: {
    syntax: "{:else}",
    description:
      "An `{#if}` block can have an `{:else}` clause.\n\n```svelte\n{#if expression}\n\t...\n{:else}\n\t...\n{/if}\n```",
    url: "https://svelte.dev/docs/svelte/if",
  },
  then: {
    syntax: "{:then name}",
    description:
      "The fulfilled branch of an `{#await}` block.\n\n```svelte\n{#await expression}\n\t...\n{:then name}\n\t...\n{/await}\n```",
    url: "https://svelte.dev/docs/svelte/await",
  },
  catch: {
    syntax: "{:catch name}",
    description:
      "The rejected branch of an `{#await}` block.\n\n```svelte\n{#await expression}\n\t...\n{:catch error}\n\t...\n{/await}\n```",
    url: "https://svelte.dev/docs/svelte/await",
  },
  render: {
    syntax: "{@render snippet(args)}",
    description:
      "To render a snippet, use an `{@render ...}` tag.\n\n```svelte\n{@render snippet(arg1, arg2)}\n```\n\nThe expression can be an identifier, or an arbitrary JavaScript expression.",
    url: "https://svelte.dev/docs/svelte/render",
  },
  html: {
    syntax: "{@html expression}",
    description:
      "To inject raw HTML into your component, use the `{@html ...}` tag.\n\n```svelte\n{@html expression}\n```\n\n> **Warning:** Svelte does not sanitize the expression before injecting the HTML. If the data comes from an untrusted source, you must escape it.",
    url: "https://svelte.dev/docs/svelte/html",
  },
  const: {
    syntax: "{@const assignment}",
    description:
      "The `{@const ...}` tag defines a local constant.\n\n```svelte\n{@const value = expression}\n```\n\n`{@const}` is only allowed as an immediate child of `{#if}`, `{:else if}`, `{:else}`, `{#each}`, `{:then}`, `{:catch}`, `<Component>` or `{#snippet}`.",
    url: "https://svelte.dev/docs/svelte/const",
  },
  debug: {
    syntax: "{@debug variables}",
    description:
      "The `{@debug ...}` tag logs the values of specific variables whenever they change, and pauses code execution if you have devtools open.\n\n```svelte\n{@debug var1, var2, ..., varN}\n```",
    url: "https://svelte.dev/docs/svelte/debug",
  },
};

// Svelte directives
const SVELTE_DIRECTIVES: Record<string, string> = {
  on: "Attach an event handler to an element.\n\nUsage: `on:eventname={handler}`\n\nModifiers: `|preventDefault`, `|stopPropagation`, `|once`, `|capture`, `|passive`, `|self`, `|trusted`",
  bind: "Bind a value to a property or component prop.\n\nUsage: `bind:property={variable}`\n\nCommon: `bind:value`, `bind:checked`, `bind:group`, `bind:this`",
  class: "Toggle a CSS class conditionally.\n\nUsage: `class:name={condition}`",
  style: "Set a style property dynamically.\n\nUsage: `style:property={value}`",
  use: "Apply an action to an element.\n\nUsage: `use:action={parameters}`\n\nActions are functions called when the element is mounted.",
  transition:
    "Apply a transition when an element enters or leaves the DOM.\n\nUsage: `transition:fn={params}`",
  in: "Apply a transition only when the element enters the DOM.\n\nUsage: `in:fn={params}`",
  out: "Apply a transition only when the element leaves the DOM.\n\nUsage: `out:fn={params}`",
  animate:
    "Apply an animation when the contents of a keyed each block are re-ordered.\n\nUsage: `animate:fn={params}`",
  let: "Receive a slot prop from a component.\n\nUsage: `let:propName={localName}`",
};

/**
 * Get hover documentation for a Vue directive.
 */
export function getVueDirectiveDoc(directive: string): string | null {
  // Direct match (v-if, @click, etc.)
  const doc = VUE_DIRECTIVES[directive];
  if (doc) return `**\`${directive}\`** (Vue directive)\n\n${doc}`;

  // @event shorthand — generic v-on doc for unknown events
  if (directive.startsWith("@")) {
    const event = directive.slice(1);
    return `**\`@${event}\`** (Vue directive)\n\nListen for the \`${event}\` event.\n\nShorthand for \`v-on:${event}\``;
  }

  // :prop shorthand
  if (directive.startsWith(":")) {
    const prop = directive.slice(1);
    return `**\`:${prop}\`** (Vue directive)\n\nDynamically bind the \`${prop}\` attribute/prop.\n\nShorthand for \`v-bind:${prop}\``;
  }

  return null;
}

/**
 * Get hover documentation for a Svelte directive.
 */
export function getSvelteDirectiveDoc(directive: string): string | null {
  const doc = SVELTE_DIRECTIVES[directive];
  if (doc) return `**\`${directive}:\`** (Svelte directive)\n\n${doc}`;
  return null;
}

/**
 * Get hover documentation for a Svelte block keyword ({#if}, {:else}, {@render}).
 */
export function getSvelteBlockDoc(
  prefix: string,
  keyword: string,
): string | null {
  const entry = SVELTE_BLOCKS[keyword];
  if (!entry) return null;
  const parts = [
    `**\`${entry.syntax}\`**`,
    "",
    entry.description,
    "",
    `[Svelte docs](${entry.url})`,
  ];
  return parts.join("\n");
}

// ── Public API ──────────────────────────────────────────────────────

function descriptionToString(
  desc: { kind: string; value: string } | string | undefined,
): string {
  if (!desc) return "";
  return typeof desc === "string" ? desc : desc.value;
}

/**
 * Get hover documentation for an HTML element tag.
 * Returns framework-specific docs for SFC block tags (template/script/style)
 * and VSCode-quality HTML element docs for everything else.
 */
export async function getHtmlTagDoc(
  tag: string,
  framework?: string,
): Promise<string | null> {
  // Framework-specific SFC block overrides
  if (framework === "vue") {
    const vueDoc = VUE_SFC_BLOCKS[tag];
    if (vueDoc) return `**\`<${tag}>\`** (Vue SFC)\n\n${vueDoc}`;
  }
  if (framework === "svelte") {
    const svelteDoc = SVELTE_SFC_BLOCKS[tag];
    if (svelteDoc) return `**\`<${tag}>\`** (Svelte)\n\n${svelteDoc}`;
  }

  // VSCode HTML data
  await ensureHtmlData();
  const entry = htmlTagMap?.get(tag);
  if (!entry) return null;

  const desc = descriptionToString(entry.description);
  const mdnRef = entry.references?.find((r) => r.name === "MDN Reference");
  let result = `**\`<${tag}>\`**`;
  if (desc) result += ` \u2014 ${desc}`;
  if (mdnRef) result += `\n\n[MDN Reference](${mdnRef.url})`;
  return result;
}

/**
 * Get hover documentation for an HTML attribute.
 */
export async function getHtmlAttrDoc(
  attr: string,
  parentTag?: string,
): Promise<string | null> {
  await ensureHtmlData();
  if (!htmlAttrMap) return null;

  // Check element-specific attributes first
  if (parentTag) {
    const tagAttrs = htmlAttrMap.get(parentTag);
    if (tagAttrs?.has(attr)) {
      return `**\`${attr}\`** attribute \u2014 ${tagAttrs.get(attr)}`;
    }
  }

  // Check global attributes
  const globalAttrs = htmlAttrMap.get("__global__");
  if (globalAttrs?.has(attr)) {
    return `**\`${attr}\`** attribute \u2014 ${globalAttrs.get(attr)}`;
  }

  return null;
}

/**
 * Get hover documentation for a CSS property matching VSCode quality.
 * Includes syntax, description, and MDN link.
 */
export async function getCssPropertyDoc(prop: string): Promise<string | null> {
  await ensureCssData();
  const entry = cssPropMap?.get(prop);
  if (!entry) return null;

  const parts: string[] = [];
  if (entry.syntax) {
    parts.push(`\`${entry.name}: ${entry.syntax}\``);
  } else {
    parts.push(`\`${entry.name}\``);
  }
  if (entry.description) {
    parts.push("", entry.description);
  }
  const mdnRef = entry.references?.find((r) => r.name === "MDN Reference");
  if (mdnRef) {
    parts.push("", `[MDN Reference](${mdnRef.url})`);
  }
  return parts.join("\n");
}

/**
 * Get all HTML tag names (for completion suggestions).
 */
export async function getHtmlTagNames(): Promise<string[]> {
  await ensureHtmlData();
  return htmlTagMap ? Array.from(htmlTagMap.keys()) : [];
}

/**
 * Get a short description for an HTML tag (for completion detail).
 */
export async function getHtmlTagSummary(tag: string): Promise<string> {
  await ensureHtmlData();
  const entry = htmlTagMap?.get(tag);
  if (!entry) return "";
  const desc = descriptionToString(entry.description);
  // Truncate to first sentence for completion items
  const dot = desc.indexOf(".");
  return dot > 0 ? desc.slice(0, dot + 1) : desc;
}

/**
 * Get all CSS property names (for completion suggestions).
 */
export async function getCssPropertyNames(): Promise<string[]> {
  await ensureCssData();
  return cssPropMap ? Array.from(cssPropMap.keys()) : [];
}

/**
 * Get a short description for a CSS property (for completion detail).
 */
export async function getCssPropertySummary(prop: string): Promise<string> {
  await ensureCssData();
  const entry = cssPropMap?.get(prop);
  return entry?.description ?? "";
}
