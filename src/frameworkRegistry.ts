import type { StudioFramework } from "../types/studio";
import type { ProjectConfig } from "./project";

export type FrameworkContext = {
  needsVueImporter?: boolean;
};

/** Parameters for generating route code for a specific page. */
export type PageRouteParams = {
  /** User's chosen page name, e.g. "Dashboard" */
  name: string;
  /** User's chosen route path, e.g. "/dashboard" */
  route: string;
  /** Relative path from server.ts to the framework directory */
  dir: string;
  ctx?: FrameworkContext;
};

export type FrameworkMeta = {
  configKey: keyof ProjectConfig;
  extension: string;
  dependencies: string[];
  devDependencies: string[];
  /** Imports needed in server.ts for this page */
  pageImports: (params: PageRouteParams) => string[];
  /** Route code to inject into server.ts for this page */
  pageRouteCode: (params: PageRouteParams) => string;
  /** Template content for a new page file */
  pageTemplate: (name: string) => string;
  /** CSS template for the shared styles directory (React/Svelte) */
  cssTemplate?: (name: string) => string;
  /** Whether the framework handles CSS inline (e.g. Vue <style>, Svelte css:'injected').
   *  When true, Studio won't create a standalone CSS file in stylesConfig. */
  usesInlineCSS?: boolean;
};

/** Convert PascalCase to kebab-case */
const toKebab = (str: string) =>
  str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const FRAMEWORKS: Record<StudioFramework, FrameworkMeta> = {
  react: {
    configKey: "reactDirectory",
    extension: ".tsx",
    dependencies: ["react", "react-dom"],
    devDependencies: ["@types/react"],
    pageImports: ({ name, dir }) => [
      `import { handleReactPageRequest } from '@absolutejs/absolute';`,
      `import { ${name} } from '${dir}/pages/${name}';`,
    ],
    pageRouteCode: ({ name, route }) =>
      `\t.get('${route}', () =>
\t\thandleReactPageRequest(
\t\t\t${name},
\t\t\tasset(manifest, '${name}Index'),
\t\t\t{ cssPath: asset(manifest, '${name}CSS') }
\t\t)
\t)`,
    pageTemplate: (name) => {
      const kebab = toKebab(name);
      return `import { useState } from 'react'

type ${name}Props = {
\tcssPath?: string
}

export function ${name}({ cssPath }: ${name}Props) {
\tconst [count, setCount] = useState(0)

\treturn (
\t\t<html>
\t\t\t<head>
\t\t\t\t<meta charSet="utf-8" />
\t\t\t\t<title>AbsoluteJS + React</title>
\t\t\t\t<meta content="AbsoluteJS React Page" name="description" />
\t\t\t\t<meta content="width=device-width, initial-scale=1" name="viewport" />
\t\t\t\t<link href="/assets/ico/favicon.ico" rel="icon" />
\t\t\t\t<link href="https://fonts.googleapis.com" rel="preconnect" />
\t\t\t\t<link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
\t\t\t\t<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100..900&display=swap" rel="stylesheet" />
\t\t\t\t{cssPath && <link href={cssPath} rel="stylesheet" type="text/css" />}
\t\t\t</head>
\t\t\t<body>
\t\t\t\t<header>
\t\t\t\t\t<a href="/">AbsoluteJS</a>
\t\t\t\t\t<details
\t\t\t\t\t\tonPointerEnter={(e) => { if (e.pointerType === 'mouse') e.currentTarget.open = true }}
\t\t\t\t\t\tonPointerLeave={(e) => { if (e.pointerType === 'mouse') e.currentTarget.open = false }}
\t\t\t\t\t>
\t\t\t\t\t\t<summary>Pages</summary>
\t\t\t\t\t\t<nav>
\t\t\t\t\t\t\t<a href="/react">React</a>
\t\t\t\t\t\t\t<a href="/html">HTML</a>
\t\t\t\t\t\t\t<a href="/svelte">Svelte</a>
\t\t\t\t\t\t\t<a href="/vue">Vue</a>
\t\t\t\t\t\t\t<a href="/htmx">HTMX</a>
\t\t\t\t\t\t\t<a href="/angular">Angular</a>
\t\t\t\t\t\t</nav>
\t\t\t\t\t</details>
\t\t\t\t</header>
\t\t\t\t<main>
\t\t\t\t\t<nav>
\t\t\t\t\t\t<a href="https://absolutejs.com" target="_blank">
\t\t\t\t\t\t\t<img className="logo" src="/assets/png/absolutejs-temp.png" alt="AbsoluteJS Logo" />
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<a href="https://react.dev/">
\t\t\t\t\t\t\t<img className="logo react" src="/assets/svg/react.svg" alt="React Logo" />
\t\t\t\t\t\t</a>
\t\t\t\t\t</nav>
\t\t\t\t\t<h1>AbsoluteJS + React</h1>
\t\t\t\t\t<button onClick={() => setCount(count + 1)}>count is {count}</button>
\t\t\t\t\t<p>Edit <code>src/frontend/react/pages/${name}.tsx</code> and save to test HMR.</p>
\t\t\t\t\t<p style={{ marginTop: '2rem' }}>Explore the other pages to see multiple frameworks running together.</p>
\t\t\t\t\t<p style={{ color: '#777', fontSize: '1rem', marginTop: '2rem' }}>Click on the AbsoluteJS and React logos to learn more.</p>
\t\t\t\t</main>
\t\t\t</body>
\t\t</html>
\t)
}
`;
    },
    cssTemplate: () => `@import url('./reset.css');

header {
\talign-items: center;
\tbackground-color: #1a1a1a;
\tbox-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
\tdisplay: flex;
\tjustify-content: space-between;
\tpadding: 2rem;
\ttext-align: center;
}

header a {
\tposition: relative;
\tcolor: #5fbeeb;
\ttext-decoration: none;
}

header a::after {
\tcontent: '';
\tposition: absolute;
\tleft: 0;
\tbottom: 0;
\twidth: 100%;
\theight: 2px;
\tbackground: linear-gradient(90deg, #5fbeeb 0%, #35d5a2 50%, #ff4b91 100%);
\ttransform: scaleX(0);
\ttransform-origin: left;
\ttransition: transform 0.25s ease-in-out;
}

header a:hover::after {
\ttransform: scaleX(1);
}

h1 {
\tfont-size: 2.5rem;
\tmargin-top: 2rem;
}

.logo {
\theight: 8rem;
\twidth: 8rem;
\twill-change: filter;
\ttransition: filter 300ms;
}

.logo:hover {
\tfilter: drop-shadow(0 0 2rem #5fbeeb);
}

.logo.react:hover {
\tfilter: drop-shadow(0 0 2rem #61dafbaa);
}

button:hover {
\tborder-color: #61dafbaa;
}

nav {
\tdisplay: flex;
\tgap: 4rem;
\tjustify-content: center;
}

header details {
\tposition: relative;
}

header details summary {
\tlist-style: none;
\tappearance: none;
\t-webkit-appearance: none;
\tcursor: pointer;
\tuser-select: none;
\tcolor: #5fbeeb;
\tfont-size: 1.5rem;
\tfont-weight: 500;
\tpadding: 0.5rem 1rem;
}

header summary::after {
\tcontent: '▼';
\tdisplay: inline-block;
\tmargin-left: 0.5rem;
\tfont-size: 0.75rem;
\ttransition: transform 0.3s ease;
}

header details[open] summary::after {
\ttransform: rotate(180deg);
}

header details nav {
\tcontent-visibility: visible;
\tposition: absolute;
\ttop: 100%;
\tright: -0.5rem;
\tdisplay: flex;
\tflex-direction: column;
\tgap: 0.75rem;
\tbackground: rgba(185, 185, 185, 0.1);
\tbackdrop-filter: blur(4px);
\tborder: 1px solid #5fbeeb;
\tborder-radius: 1rem;
\tpadding: 1rem 1.5rem;
\tbox-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
\topacity: 0;
\ttransform: translateY(-8px);
\tpointer-events: none;
\ttransition: opacity 0.3s ease, transform 0.3s ease;
\tz-index: 1000;
}

header details[open] nav {
\topacity: 1;
\ttransform: translateY(0);
\tpointer-events: auto;
}

header details nav a {
\tfont-size: 1.1rem;
\tpadding: 0.25rem 0;
\twhite-space: nowrap;
}

@media (max-width: 480px) {
\theader { padding: 1rem; }
\th1 { font-size: 1.75rem; }
\t.logo { height: 5rem; width: 5rem; }
\tnav { gap: 2rem; }
\theader details summary { font-size: 1.2rem; }
}

@media (prefers-color-scheme: light) {
\theader { background-color: #ffffff; }
\tbutton { background-color: #ffffff; }
}

@keyframes logo-spin {
\tfrom { transform: rotate(0deg); }
\tto { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: no-preference) {
\ta:nth-of-type(2) .logo { animation: logo-spin infinite 20s linear; }
}
`,
  },

  svelte: {
    configKey: "svelteDirectory",
    extension: ".svelte",
    dependencies: ["svelte"],
    devDependencies: ["prettier-plugin-svelte"],
    pageImports: ({ name, dir }) => [
      `import { handleSveltePageRequest } from '@absolutejs/absolute/svelte';`,
      `import ${name} from '${dir}/pages/${name}.svelte';`,
    ],
    pageRouteCode: ({ name, route }) =>
      `\t.get('${route}', () =>
\t\thandleSveltePageRequest(
\t\t\t${name},
\t\t\tasset(manifest, '${name}'),
\t\t\tasset(manifest, '${name}Index'),
\t\t\t{ initialCount: 0, cssPath: asset(manifest, '${name}CSS') }
\t\t)
\t)`,
    pageTemplate: (name) => `<script lang="ts">
\tlet { initialCount = 0, cssPath = '' }: { initialCount?: number; cssPath?: string } = $props()
\tlet count = $state(initialCount)
\tlet dropdown: HTMLDetailsElement

\tconst openDropdown = (event: PointerEvent) => {
\t\tif (event.pointerType === 'mouse') {
\t\t\tdropdown.open = true
\t\t}
\t}

\tconst closeDropdown = (event: PointerEvent) => {
\t\tif (event.pointerType === 'mouse') {
\t\t\tdropdown.open = false
\t\t}
\t}
</script>

<svelte:head>
\t<meta charset="utf-8" />
\t<title>AbsoluteJS + Svelte</title>
\t<meta name="description" content="AbsoluteJS Svelte Page" />
\t<meta name="viewport" content="width=device-width, initial-scale=1" />
\t<link rel="icon" href="/assets/ico/favicon.ico" />
\t<link rel="preconnect" href="https://fonts.googleapis.com" />
\t<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
\t<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100..900&display=swap" rel="stylesheet" />
\t<link rel="stylesheet" href={cssPath} type="text/css" />
</svelte:head>

<header>
\t<a href="/">AbsoluteJS</a>
\t<details bind:this={dropdown} onpointerenter={openDropdown} onpointerleave={closeDropdown}>
\t\t<summary>Pages</summary>
\t\t<nav>
\t\t\t<a href="/react">React</a>
\t\t\t<a href="/html">HTML</a>
\t\t\t<a href="/svelte">Svelte</a>
\t\t\t<a href="/vue">Vue</a>
\t\t\t<a href="/htmx">HTMX</a>
\t\t\t<a href="/angular">Angular</a>
\t\t</nav>
\t</details>
</header>

<main>
\t<nav>
\t\t<a href="https://absolutejs.com" target="_blank">
\t\t\t<img class="logo" src="/assets/png/absolutejs-temp.png" alt="AbsoluteJS Logo" />
\t\t</a>
\t\t<a href="https://svelte.dev" target="_blank">
\t\t\t<img class="logo svelte" src="/assets/svg/svelte-logo.svg" alt="Svelte Logo" />
\t\t</a>
\t</nav>
\t<h1>AbsoluteJS + Svelte</h1>
\t<button onclick={() => count++}>count is {count}</button>
\t<p>Edit <code>src/frontend/svelte/pages/${name}.svelte</code> and save to test HMR.</p>
\t<p style="margin-top: 2rem;">Explore the other pages to see multiple frameworks running together.</p>
\t<p style="color: #777; font-size: 1rem; margin-top: 2rem;">Click on the AbsoluteJS and Svelte logos to learn more.</p>
</main>

<style>
\theader {
\t\talign-items: center;
\t\tbackground-color: #1a1a1a;
\t\tbox-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
\t\tdisplay: flex;
\t\tjustify-content: space-between;
\t\tpadding: 2rem;
\t\ttext-align: center;
\t}
\theader a { position: relative; color: #5fbeeb; text-decoration: none; }
\theader a::after {
\t\tcontent: '';
\t\tposition: absolute;
\t\tleft: 0; bottom: 0; width: 100%; height: 2px;
\t\tbackground: linear-gradient(90deg, #5fbeeb 0%, #35d5a2 50%, #ff4b91 100%);
\t\ttransform: scaleX(0);
\t\ttransform-origin: left;
\t\ttransition: transform 0.25s ease-in-out;
\t}
\theader a:hover::after { transform: scaleX(1); }
\th1 { font-size: 2.5rem; margin-top: 2rem; }
\t.logo { height: 8rem; width: 8rem; will-change: filter; transition: filter 300ms; }
\t.logo:hover { filter: drop-shadow(0 0 2rem #5fbeeb); }
\t.logo.svelte:hover { filter: drop-shadow(0 0 2rem #ff3e00); }
\tbutton:hover { border-color: #ff3e00; }
\tnav { display: flex; gap: 4rem; justify-content: center; }
\theader details { position: relative; }
\theader details summary {
\t\tlist-style: none; appearance: none; -webkit-appearance: none;
\t\tcursor: pointer; user-select: none; color: #5fbeeb;
\t\tfont-size: 1.5rem; font-weight: 500; padding: 0.5rem 1rem;
\t}
\theader summary::after { content: '▼'; display: inline-block; margin-left: 0.5rem; font-size: 0.75rem; transition: transform 0.3s ease; }
\theader details[open] summary::after { transform: rotate(180deg); }
\theader details nav {
\t\tcontent-visibility: visible; position: absolute; top: 100%; right: -0.5rem;
\t\tdisplay: flex; flex-direction: column; gap: 0.75rem;
\t\tbackground: rgba(185, 185, 185, 0.1); backdrop-filter: blur(4px);
\t\tborder: 1px solid #5fbeeb; border-radius: 1rem; padding: 1rem 1.5rem;
\t\tbox-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); opacity: 0;
\t\ttransform: translateY(-8px); pointer-events: none;
\t\ttransition: opacity 0.3s ease, transform 0.3s ease; z-index: 1000;
\t}
\theader details[open] nav { opacity: 1; transform: translateY(0); pointer-events: auto; }
\theader details nav a { font-size: 1.1rem; padding: 0.25rem 0; white-space: nowrap; }
\tcode {
\t\tbackground-color: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.1);
\t\tborder-radius: 0.375rem; font-family: 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
\t\tfont-size: 0.875em; padding: 0.2rem 0.5rem;
\t}
\t@media (max-width: 480px) {
\t\theader { padding: 1rem; }
\t\th1 { font-size: 1.75rem; }
\t\t.logo { height: 5rem; width: 5rem; }
\t\tnav { gap: 2rem; }
\t\theader details summary { font-size: 1.2rem; }
\t}
\t@media (prefers-color-scheme: light) {
\t\theader { background-color: #ffffff; }
\t\tcode { background-color: rgba(0, 0, 0, 0.06); border-color: rgba(0, 0, 0, 0.1); }
\t}
</style>
`,
    cssTemplate: () => `@import url('./reset.css');
`,
  },

  vue: {
    configKey: "vueDirectory",
    extension: ".vue",
    dependencies: ["vue"],
    devDependencies: [],
    pageImports: ({ name, dir, ctx }) => {
      const base = [
        `import { handleVuePageRequest } from '@absolutejs/absolute/vue';`,
        `import { generateHeadElement } from '@absolutejs/absolute';`,
      ];
      if (ctx?.needsVueImporter) {
        base.push(`import { vueImports } from './utils/vueImporter';`);
      } else {
        base.push(`import ${name} from '${dir}/pages/${name}.vue';`);
      }
      return base;
    },
    pageRouteCode: ({ name, route, ctx }) => {
      const component = ctx?.needsVueImporter ? `vueImports.${name}` : name;
      return `\t.get('${route}', () =>
\t\thandleVuePageRequest(
\t\t\t${component},
\t\t\tasset(manifest, '${name}'),
\t\t\tasset(manifest, '${name}Index'),
\t\t\tgenerateHeadElement({
\t\t\t\tcssPath: asset(manifest, '${name}CSS'),
\t\t\t\ttitle: '${name}'
\t\t\t})
\t\t)
\t)`;
    },
    pageTemplate: (name) => `<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const dropdown = ref<HTMLDetailsElement>()

const openDropdown = (event: PointerEvent) => {
\tif (event.pointerType === 'mouse' && dropdown.value) {
\t\tdropdown.value.open = true
\t}
}

const closeDropdown = (event: PointerEvent) => {
\tif (event.pointerType === 'mouse' && dropdown.value) {
\t\tdropdown.value.open = false
\t}
}
</script>

<template>
\t<header>
\t\t<a href="/">AbsoluteJS</a>
\t\t<details ref="dropdown" @pointerenter="openDropdown" @pointerleave="closeDropdown">
\t\t\t<summary>Pages</summary>
\t\t\t<nav>
\t\t\t\t<a href="/react">React</a>
\t\t\t\t<a href="/html">HTML</a>
\t\t\t\t<a href="/svelte">Svelte</a>
\t\t\t\t<a href="/vue">Vue</a>
\t\t\t\t<a href="/htmx">HTMX</a>
\t\t\t\t<a href="/angular">Angular</a>
\t\t\t</nav>
\t\t</details>
\t</header>

\t<main>
\t\t<nav>
\t\t\t<a href="https://absolutejs.com" target="_blank">
\t\t\t\t<img class="logo" src="/assets/png/absolutejs-temp.png" alt="AbsoluteJS Logo" />
\t\t\t</a>
\t\t\t<a href="https://vuejs.org" target="_blank">
\t\t\t\t<img class="logo vue" src="/assets/svg/vue-logo.svg" alt="Vue Logo" />
\t\t\t</a>
\t\t</nav>
\t\t<h1>AbsoluteJS + Vue</h1>
\t\t<button @click="count++">count is {{ count }}</button>
\t\t<p>Edit <code>src/frontend/vue/pages/${name}.vue</code> and save to test HMR.</p>
\t\t<p style="margin-top: 2rem">Explore the other pages to see multiple frameworks running together.</p>
\t\t<p style="color: #777; font-size: 1rem; margin-top: 2rem">Click on the AbsoluteJS and Vue logos to learn more.</p>
\t</main>
</template>
`,
    cssTemplate: () => `@import url('./reset.css');

#root {
\tdisplay: flex;
\tflex-direction: column;
\tmargin: 0 auto;
\theight: 100%;
\twidth: 100%;
}

header {
\talign-items: center;
\tbackground-color: #1a1a1a;
\tbox-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
\tdisplay: flex;
\tjustify-content: space-between;
\tpadding: 2rem;
\ttext-align: center;
}

header a { position: relative; color: #5fbeeb; text-decoration: none; }

header a::after {
\tcontent: '';
\tposition: absolute;
\tleft: 0; bottom: 0; width: 100%; height: 2px;
\tbackground: linear-gradient(90deg, #5fbeeb 0%, #35d5a2 50%, #ff4b91 100%);
\ttransform: scaleX(0); transform-origin: left; transition: transform 0.25s ease-in-out;
}

header a:hover::after { transform: scaleX(1); }

h1 { font-size: 2.5rem; margin-top: 2rem; }

.logo { height: 8rem; width: 8rem; will-change: filter; transition: filter 300ms; }
.logo:hover { filter: drop-shadow(0 0 2rem #5fbeeb); }
.logo.vue:hover { filter: drop-shadow(0 0 2rem #42b883); }

button:hover { border-color: #42b883; }

nav { display: flex; gap: 4rem; justify-content: center; }

header details { position: relative; }
header details summary {
\tlist-style: none; appearance: none; -webkit-appearance: none; cursor: pointer;
\tuser-select: none; color: #5fbeeb; font-size: 1.5rem; font-weight: 500; padding: 0.5rem 1rem;
}
header summary::after { content: '▼'; display: inline-block; margin-left: 0.5rem; font-size: 0.75rem; transition: transform 0.3s ease; }
header details[open] summary::after { transform: rotate(180deg); }
header details nav {
\tcontent-visibility: visible; position: absolute; top: 100%; right: -0.5rem;
\tdisplay: flex; flex-direction: column; gap: 0.75rem;
\tbackground: rgba(128, 128, 128, 0.15); backdrop-filter: blur(4px);
\tborder: 1px solid #5fbeeb; border-radius: 1rem; padding: 1rem 1.5rem;
\tbox-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); opacity: 0;
\ttransform: translateY(-8px); pointer-events: none;
\ttransition: opacity 0.3s ease, transform 0.3s ease; z-index: 1000;
}
header details[open] nav { opacity: 1; transform: translateY(0); pointer-events: auto; }
header details nav a { font-size: 1.1rem; padding: 0.25rem 0; white-space: nowrap; }

code {
\tbackground-color: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.1);
\tborder-radius: 0.375rem; font-family: 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
\tfont-size: 0.875em; padding: 0.2rem 0.5rem;
}

@media (max-width: 480px) {
\theader { padding: 1rem; }
\th1 { font-size: 1.75rem; }
\t.logo { height: 5rem; width: 5rem; }
\tnav { gap: 2rem; }
\theader details summary { font-size: 1.2rem; }
}

@media (prefers-color-scheme: light) {
\theader { background-color: #ffffff; }
\tbutton { background-color: #ffffff; }
\tcode { background-color: rgba(0, 0, 0, 0.06); border-color: rgba(0, 0, 0, 0.1); }
}
`,
  },

  html: {
    configKey: "htmlDirectory",
    extension: ".html",
    dependencies: [],
    devDependencies: [],
    pageImports: () => [
      `import { handleHTMLPageRequest } from '@absolutejs/absolute';`,
    ],
    pageRouteCode: ({ name, route }) =>
      `\t.get('${route}', () => handleHTMLPageRequest(asset(manifest, '${name}')))`,
    pageTemplate: (name) => `<!doctype html>
<html>
\t<head>
\t\t<title>AbsoluteJS + HTML</title>
\t\t<meta name="description" content="AbsoluteJS HTML Page" />
\t\t<meta charset="utf-8" />
\t\t<meta name="viewport" content="width=device-width, initial-scale=1" />
\t\t<link rel="stylesheet" type="text/css" href="../styles/${toKebab(name)}.css" />
\t\t<link rel="icon" href="/assets/ico/favicon.ico" />
\t</head>
\t<body>
\t\t<header>
\t\t\t<a href="/">AbsoluteJS</a>
\t\t\t<details
\t\t\t\tonpointerenter="if(event.pointerType==='mouse')this.open=true"
\t\t\t\tonpointerleave="if(event.pointerType==='mouse')this.open=false"
\t\t\t>
\t\t\t\t<summary>Pages</summary>
\t\t\t\t<nav>
\t\t\t\t\t<a href="/react">React</a>
\t\t\t\t\t<a href="/html">HTML</a>
\t\t\t\t\t<a href="/svelte">Svelte</a>
\t\t\t\t\t<a href="/vue">Vue</a>
\t\t\t\t\t<a href="/htmx">HTMX</a>
\t\t\t\t\t<a href="/angular">Angular</a>
\t\t\t\t</nav>
\t\t\t</details>
\t\t</header>
\t\t<main>
\t\t\t<nav>
\t\t\t\t<a href="https://absolutejs.com" target="_blank">
\t\t\t\t\t<img class="logo" src="/assets/png/absolutejs-temp.png" alt="AbsoluteJS Logo" />
\t\t\t\t</a>
\t\t\t\t<a href="https://html.spec.whatwg.org/multipage/">
\t\t\t\t\t<img class="logo html" src="/assets/svg/HTML5_Badge.svg" alt="HTML Logo" />
\t\t\t\t</a>
\t\t\t</nav>
\t\t\t<h1>AbsoluteJS + HTML</h1>
\t\t\t<button id="counter-button">count is <span id="counter">0</span></button>
\t\t\t<p>Edit <code>src/frontend/html/pages/${name}.html</code> and save to test HMR.</p>
\t\t\t<p style="margin-top: 2rem">Explore the other pages to see multiple frameworks running together.</p>
\t\t\t<p style="margin-top: 2rem; font-size: 1rem; color: #777">Click on the AbsoluteJS and HTML logos to learn more.</p>
\t\t</main>
\t\t<script>
\t\t\tconst btn = document.querySelector('#counter-button');
\t\t\tconst ctr = document.querySelector('#counter');
\t\t\tlet count = 0;
\t\t\tif (btn && ctr) btn.addEventListener('click', () => { ctr.textContent = (++count).toString(); });
\t\t</script>
\t</body>
</html>
`,
    cssTemplate: (name) => `@import url('./reset.css');

header {
\talign-items: center;
\tbackground-color: #1a1a1a;
\tbox-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
\tdisplay: flex;
\tjustify-content: space-between;
\tpadding: 2rem;
\ttext-align: center;
}

header a { position: relative; color: #5fbeeb; text-decoration: none; }

header a::after {
\tcontent: '';
\tposition: absolute;
\tleft: 0; bottom: 0; width: 100%; height: 2px;
\tbackground: linear-gradient(90deg, #5fbeeb 0%, #35d5a2 50%, #ff4b91 100%);
\ttransform: scaleX(0); transform-origin: left; transition: transform 0.25s ease-in-out;
}

header a:hover::after { transform: scaleX(1); }

h1 { font-size: 2.5rem; margin-top: 2rem; }

.logo { height: 8rem; width: 8rem; will-change: filter; transition: filter 300ms; }
.logo:hover { filter: drop-shadow(0 0 2rem #5fbeeb); }
.logo.html:hover { filter: drop-shadow(0 0 2rem #e34f26); }

button:hover { border-color: #e34f26; }

nav { display: flex; gap: 4rem; justify-content: center; }

header details { position: relative; }
header details summary {
\tlist-style: none; appearance: none; -webkit-appearance: none; cursor: pointer;
\tuser-select: none; color: #5fbeeb; font-size: 1.5rem; font-weight: 500; padding: 0.5rem 1rem;
}
header summary::after { content: '▼'; display: inline-block; margin-left: 0.5rem; font-size: 0.75rem; transition: transform 0.3s ease; }
header details[open] summary::after { transform: rotate(180deg); }
header details nav {
\tcontent-visibility: visible; position: absolute; top: 100%; right: -0.5rem;
\tdisplay: flex; flex-direction: column; gap: 0.75rem;
\tbackground: rgba(185, 185, 185, 0.1); backdrop-filter: blur(4px);
\tborder: 1px solid #5fbeeb; border-radius: 1rem; padding: 1rem 1.5rem;
\tbox-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); opacity: 0;
\ttransform: translateY(-8px); pointer-events: none;
\ttransition: opacity 0.3s ease, transform 0.3s ease; z-index: 1000;
}
header details[open] nav { opacity: 1; transform: translateY(0); pointer-events: auto; }
header details nav a { font-size: 1.1rem; padding: 0.25rem 0; white-space: nowrap; }

@media (max-width: 480px) {
\theader { padding: 1rem; }
\th1 { font-size: 1.75rem; }
\t.logo { height: 5rem; width: 5rem; }
\tnav { gap: 2rem; }
\theader details summary { font-size: 1.2rem; }
}

@media (prefers-color-scheme: light) {
\theader { background-color: #ffffff; }
\tbutton { background-color: #ffffff; }
}
`,
  },

  htmx: {
    configKey: "htmxDirectory",
    extension: ".html",
    dependencies: ["elysia-scoped-state"],
    devDependencies: [],
    pageImports: () => [
      `import { handleHTMXPageRequest } from '@absolutejs/absolute';`,
      `import { scopedState } from 'elysia-scoped-state';`,
    ],
    pageRouteCode: ({ name, route }) =>
      `\t.get('${route}', () => handleHTMXPageRequest(asset(manifest, '${name}')))`,
    pageTemplate: (name) => `<!doctype html>
<html>
\t<head>
\t\t<title>AbsoluteJS + HTMX</title>
\t\t<meta name="description" content="AbsoluteJS HTMX Page" />
\t\t<meta charset="utf-8" />
\t\t<meta name="viewport" content="width=device-width, initial-scale=1" />
\t\t<link rel="stylesheet" type="text/css" href="../styles/${toKebab(name)}.css" />
\t\t<link rel="icon" href="/assets/ico/favicon.ico" />
\t\t<script src="/htmx/htmx.min.js"></script>
\t</head>
\t<body>
\t\t<header>
\t\t\t<a href="/">AbsoluteJS</a>
\t\t\t<details
\t\t\t\tonpointerenter="if(event.pointerType==='mouse')this.open=true"
\t\t\t\tonpointerleave="if(event.pointerType==='mouse')this.open=false"
\t\t\t>
\t\t\t\t<summary>Pages</summary>
\t\t\t\t<nav>
\t\t\t\t\t<a href="/react">React</a>
\t\t\t\t\t<a href="/html">HTML</a>
\t\t\t\t\t<a href="/svelte">Svelte</a>
\t\t\t\t\t<a href="/vue">Vue</a>
\t\t\t\t\t<a href="/htmx">HTMX</a>
\t\t\t\t\t<a href="/angular">Angular</a>
\t\t\t\t</nav>
\t\t\t</details>
\t\t</header>
\t\t<main>
\t\t\t<nav>
\t\t\t\t<a href="https://absolutejs.com" target="_blank">
\t\t\t\t\t<img class="logo" src="/assets/png/absolutejs-temp.png" alt="AbsoluteJS Logo" />
\t\t\t\t</a>
\t\t\t\t<a href="https://htmx.org" target="_blank">
\t\t\t\t\t<img class="logo htmx" src="/assets/svg/htmx-logo-white.svg" alt="HTMX Logo" />
\t\t\t\t</a>
\t\t\t</nav>
\t\t\t<h1>AbsoluteJS + HTMX</h1>
\t\t\t<button id="counter-button">count is <span id="counter">0</span></button>
\t\t\t<p>Edit <code>src/frontend/htmx/pages/${name}.html</code> and save to test HMR.</p>
\t\t\t<p style="margin-top: 2rem">Explore the other pages to see multiple frameworks running together.</p>
\t\t\t<p style="margin-top: 2rem; font-size: 1rem; color: #777">Click on the AbsoluteJS and HTMX logos to learn more.</p>
\t\t</main>
\t\t<script>
\t\t\tconst btn = document.querySelector('#counter-button');
\t\t\tconst ctr = document.querySelector('#counter');
\t\t\tlet count = 0;
\t\t\tif (btn && ctr) btn.addEventListener('click', () => { ctr.textContent = (++count).toString(); });
\t\t</script>
\t</body>
</html>
`,
    cssTemplate: (name) => `@import url('./reset.css');

header {
\talign-items: center;
\tbackground-color: #1a1a1a;
\tbox-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
\tdisplay: flex;
\tjustify-content: space-between;
\tpadding: 2rem;
\ttext-align: center;
}

header a { position: relative; color: #5fbeeb; text-decoration: none; }

header a::after {
\tcontent: '';
\tposition: absolute;
\tleft: 0; bottom: 0; width: 100%; height: 2px;
\tbackground: linear-gradient(90deg, #5fbeeb 0%, #35d5a2 50%, #ff4b91 100%);
\ttransform: scaleX(0); transform-origin: left; transition: transform 0.25s ease-in-out;
}

header a:hover::after { transform: scaleX(1); }

h1 { font-size: 2.5rem; margin-top: 2rem; }

.logo { height: 8rem; width: 8rem; will-change: filter; transition: filter 300ms; }
.logo:hover { filter: drop-shadow(0 0 2rem #5fbeeb); }
.logo.htmx:hover { filter: drop-shadow(0 0 2rem #3465a4); }

button:hover { border-color: #3465a4; }

nav { display: flex; gap: 4rem; justify-content: center; }

header details { position: relative; }
header details summary {
\tlist-style: none; appearance: none; -webkit-appearance: none; cursor: pointer;
\tuser-select: none; color: #5fbeeb; font-size: 1.5rem; font-weight: 500; padding: 0.5rem 1rem;
}
header summary::after { content: '▼'; display: inline-block; margin-left: 0.5rem; font-size: 0.75rem; transition: transform 0.3s ease; }
header details[open] summary::after { transform: rotate(180deg); }
header details nav {
\tcontent-visibility: visible; position: absolute; top: 100%; right: -0.5rem;
\tdisplay: flex; flex-direction: column; gap: 0.75rem;
\tbackground: rgba(185, 185, 185, 0.1); backdrop-filter: blur(4px);
\tborder: 1px solid #5fbeeb; border-radius: 1rem; padding: 1rem 1.5rem;
\tbox-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); opacity: 0;
\ttransform: translateY(-8px); pointer-events: none;
\ttransition: opacity 0.3s ease, transform 0.3s ease; z-index: 1000;
}
header details[open] nav { opacity: 1; transform: translateY(0); pointer-events: auto; }
header details nav a { font-size: 1.1rem; padding: 0.25rem 0; white-space: nowrap; }

@media (max-width: 480px) {
\theader { padding: 1rem; }
\th1 { font-size: 1.75rem; }
\t.logo { height: 5rem; width: 5rem; }
\tnav { gap: 2rem; }
\theader details summary { font-size: 1.2rem; }
}

@media (prefers-color-scheme: light) {
\theader { background-color: #ffffff; }
\tbutton { background-color: #ffffff; }
}
`,
  },

  angular: {
    configKey: "angularDirectory",
    extension: ".ts",
    dependencies: [
      "@angular/common",
      "@angular/compiler",
      "@angular/compiler-cli",
      "@angular/core",
      "@angular/platform-browser",
      "@angular/platform-server",
      "@angular/ssr",
    ],
    devDependencies: [],
    pageImports: () => [
      `import { handleAngularPageRequest } from '@absolutejs/absolute/angular';`,
      `import { generateHeadElement } from '@absolutejs/absolute';`,
    ],
    pageRouteCode: ({ name, route, dir }) => {
      // Angular uses kebab-case file names
      const fileName = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      return `\t.get('${route}', async () =>
\t\thandleAngularPageRequest(
\t\t\t() => import('${dir}/pages/${fileName}'),
\t\t\tasset(manifest, '${name}'),
\t\t\tasset(manifest, '${name}Index'),
\t\t\tgenerateHeadElement({
\t\t\t\ttitle: '${name}'
\t\t\t})
\t\t)
\t)`;
    },
    pageTemplate: (name) => `import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
\tselector: 'page-${name.toLowerCase()}',
\tstandalone: true,
\timports: [CommonModule],
\ttemplate: \`
\t\t<main>
\t\t\t<nav>
\t\t\t\t<a href="https://absolutejs.com" target="_blank">
\t\t\t\t\t<img class="logo" src="/assets/png/absolutejs-temp.png" alt="AbsoluteJS Logo" />
\t\t\t\t</a>
\t\t\t\t<a href="https://angular.io" target="_blank">
\t\t\t\t\t<img class="logo angular" src="/assets/svg/angular-logo.svg" alt="Angular Logo" />
\t\t\t\t</a>
\t\t\t</nav>
\t\t\t<h1>AbsoluteJS + Angular</h1>
\t\t\t<button (click)="increment()">count is {{ count }}</button>
\t\t\t<p>Edit <code>src/frontend/angular/pages/${name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}.ts</code> and save to test HMR.</p>
\t\t\t<p style="margin-top: 2rem">Explore the other pages to see multiple frameworks running together.</p>
\t\t\t<p style="color: #777; font-size: 1rem; margin-top: 2rem">Click on the AbsoluteJS and Angular logos to learn more.</p>
\t\t</main>
\t\`,
\tstyles: [\`
\t\t:host { display: block; }
\t\tmain { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
\t\tnav { display: flex; gap: 4rem; justify-content: center; }
\t\t.logo { height: 8rem; width: 8rem; will-change: filter; transition: filter 300ms; }
\t\t.logo:hover { filter: drop-shadow(0 0 2rem #5fbeeb); }
\t\t.logo.angular:hover { filter: drop-shadow(0 0 2rem #dd0031); }
\t\th1 { font-size: 2.5rem; margin-top: 2rem; }
\t\tbutton { background-color: #1a1a1a; border: 1px solid transparent; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; font-family: inherit; font-size: 1.1rem; font-weight: 500; margin: 2rem 0; padding: 0.6rem 1.2rem; transition: border-color 0.25s; }
\t\tbutton:hover { border-color: #dd0031; }
\t\tp { font-size: 1.2rem; max-width: 1280px; }
\t\tcode { background-color: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.375rem; font-family: 'SF Mono', SFMono-Regular, Consolas, monospace; font-size: 0.875em; padding: 0.2rem 0.5rem; }
\t\`]
})
export class ${name}Component {
\tcount = 0
\tincrement() { this.count++ }
}

export default function ${name}Page() {
\treturn ${name}Component
}
`,
  },
};

export const getFrameworkMeta = (framework: StudioFramework): FrameworkMeta => {
  return FRAMEWORKS[framework];
};

export const ALL_FRAMEWORKS: StudioFramework[] = [
  "react",
  "svelte",
  "vue",
  "html",
  "htmx",
  "angular",
];
