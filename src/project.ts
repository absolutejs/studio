import { join, dirname, resolve, relative, basename } from "path";
import { Glob } from "bun";
import {
  mkdirSync,
  existsSync,
  cpSync,
  readdirSync,
  renameSync,
  rmSync,
  unlinkSync,
} from "fs";
import type { StudioFramework } from "../types/studio";
import { getFrameworkMeta, ALL_FRAMEWORKS } from "./frameworkRegistry";
import type { FrameworkContext } from "./frameworkRegistry";

export type ProjectConfig = {
  reactDirectory?: string;
  svelteDirectory?: string;
  vueDirectory?: string;
  htmlDirectory?: string;
  htmxDirectory?: string;
  angularDirectory?: string;
};

type ScannedPage = {
  name: string;
  route: string;
  framework: StudioFramework;
  file?: string;
};

const PAGE_HANDLER_FRAMEWORK: Record<string, StudioFramework> = {
  handleReactPageRequest: "react",
  handleSveltePageRequest: "svelte",
  handleVuePageRequest: "vue",
  handleHTMLPageRequest: "html",
  handleHTMXPageRequest: "htmx",
  handleAngularPageRequest: "angular",
};

// Match .get('/route', ...<handler>(...)) patterns
// Captures: (1) route, (2) handler name
const ROUTE_RE =
  /\.get\(\s*['"]([^'"]+)['"]\s*,\s*(?:async\s*)?\(?.*?\)?\s*=>\s*\n?\s*(handle(?:React|Svelte|Vue|HTML|HTMX|Angular)PageRequest)\b/g;

/**
 * Extract the page/component name from the handler call that follows a route match.
 * Handles all framework patterns: direct component refs, vueImports.X, asset(), dynamic imports.
 */
const extractPageName = (source: string, matchEnd: number): string | null => {
  // Get the text after the handler name — the opening paren and first argument
  const rest = source.slice(matchEnd);

  // HTML/HTMX asset: handleXPageRequest(asset(manifest, 'PageName'))
  // Anchored to start — asset() must be the first argument, not a later one
  // (React uses asset() as 2nd/3rd arg: handleReactPageRequest(Comp, asset(...)))
  const assetMatch = rest.match(/^\(\s*asset\(\s*\w+\s*,\s*['"](\w+)['"]\)/);
  if (assetMatch) return assetMatch[1]!;

  // React/Svelte/Vue direct component: handleXPageRequest(\n\t\tComponentName,
  const componentMatch = rest.match(
    /\(\s*\n?\s*(?:vueImports\.)?(\w+)\s*[,\n]/,
  );
  if (componentMatch) return componentMatch[1]!;

  // Angular dynamic import: () => import('.../pages/page-name')
  const importMatch = rest.match(
    /\(\s*\(\)\s*=>\s*import\(['"].*\/pages\/([^'"]+)['"]\)/,
  );
  if (importMatch) {
    // Angular uses kebab-case files → convert to PascalCase
    return importMatch[1]!.replace(/(^|-)(\w)/g, (_, __, c: string) =>
      c.toUpperCase(),
    );
  }

  return null;
};

/** Find the project's server file. */
const findServerFile = (projectDir: string): string | null => {
  const candidates = [
    join(projectDir, "src", "backend", "server.ts"),
    join(projectDir, "src", "server.ts"),
    join(projectDir, "server.ts"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
};

/**
 * Read a file and all its local imports (one level deep) into a single string.
 */
const readWithLocalImports = async (filePath: string): Promise<string> => {
  const sources: string[] = [];
  const content = await Bun.file(filePath).text();
  sources.push(content);

  const localImportRe = /import\s+.*?from\s+['"](\.[^'"]+)['"]/g;
  let importMatch: RegExpExecArray | null;
  while ((importMatch = localImportRe.exec(content)) !== null) {
    const importPath = importMatch[1]!;
    const dir = dirname(filePath);
    let resolved = resolve(dir, importPath);

    if (!/\.\w+$/.test(resolved)) {
      for (const ext of [".ts", ".tsx", ".js", ".jsx"]) {
        if (existsSync(`${resolved}${ext}`)) {
          resolved = `${resolved}${ext}`;
          break;
        }
      }
    }

    if (existsSync(resolved)) {
      try {
        sources.push(await Bun.file(resolved).text());
      } catch {
        // skip unreadable
      }
    }
  }

  return sources.join("\n");
};

/**
 * Scan the user's server.ts (and local imports) for .get() routes
 * that use one of the 6 absolutejs page handlers.
 */
export const scanProjectPages = async (
  projectDir: string,
  config?: ProjectConfig,
) => {
  const pages: ScannedPage[] = [];

  const serverPath = findServerFile(projectDir);
  if (!serverPath) return pages;

  const fullSource = await readWithLocalImports(serverPath);

  let routeMatch: RegExpExecArray | null;
  while ((routeMatch = ROUTE_RE.exec(fullSource)) !== null) {
    const route = routeMatch[1]!;
    const handler = routeMatch[2]!;
    const framework = PAGE_HANDLER_FRAMEWORK[handler];
    if (!framework) continue;

    // Extract the actual component/page name from the handler call
    const extractedName = extractPageName(
      fullSource,
      routeMatch.index + routeMatch[0].length,
    );
    const name =
      extractedName ??
      (route === "/"
        ? "Home"
        : route
            .replace(/^\//, "")
            .split("/")[0]!
            .replace(/^./, (c) => c.toUpperCase()));

    // Find the source file by name in the configured directory
    let file: string | undefined;
    const meta = getFrameworkMeta(framework);
    if (config) {
      const configKey = `${framework}Directory` as keyof ProjectConfig;
      const dir = config[configKey];
      if (dir) {
        const candidate = join(dir, "pages", `${name}${meta.extension}`);
        if (existsSync(candidate)) {
          file = candidate;
        }
      }
    }

    // Fallback: try common directory patterns if config dir wasn't set or file wasn't found
    if (!file) {
      const fallbackDirs = [
        join(projectDir, "src", "frontend", framework, "pages"),
        join(projectDir, "src", framework, "pages"),
      ];
      for (const dir of fallbackDirs) {
        const candidate = join(dir, `${name}${meta.extension}`);
        if (existsSync(candidate)) {
          file = candidate;
          break;
        }
      }
    }

    pages.push({
      name,
      route,
      framework,
      file: file ? resolve(file) : undefined,
    });
  }

  return pages;
};

const CONFIG_KEY_MAP: {
  key: keyof ProjectConfig;
  framework: StudioFramework;
}[] = [
  { key: "reactDirectory", framework: "react" },
  { key: "svelteDirectory", framework: "svelte" },
  { key: "vueDirectory", framework: "vue" },
  { key: "htmlDirectory", framework: "html" },
  { key: "htmxDirectory", framework: "htmx" },
  { key: "angularDirectory", framework: "angular" },
];

export const getConfiguredFrameworks = (
  config: ProjectConfig,
): { framework: StudioFramework; directory: string }[] => {
  const result: { framework: StudioFramework; directory: string }[] = [];
  for (const { key, framework } of CONFIG_KEY_MAP) {
    const directory = config[key];
    if (directory) result.push({ framework, directory });
  }
  return result;
};

// ── Template example page names per framework ────────────────
const TEMPLATE_PAGE_NAMES: Record<StudioFramework, string> = {
  react: "ReactExample",
  svelte: "SvelteExample",
  vue: "VueExample",
  html: "HTMLExample",
  htmx: "HTMXExample",
  angular: "AngularExample",
};

// ── Page creation ─────────────────────────────────────────────

/**
 * Create a page file. If the template's example page exists (from scaffolding),
 * rename it to the user's chosen name so they get the full example with counter/layout.
 * Otherwise fall back to generating a minimal page from the template function.
 */
/** Convert PascalCase to kebab-case, e.g. "SvelteExample" → "svelte-example" */
const toKebab = (str: string) =>
  str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

export const createPageFile = async (
  name: string,
  directory: string,
  framework: StudioFramework,
  stylesDirectory?: string,
) => {
  const meta = getFrameworkMeta(framework);
  const pagesDir = join(directory, "pages");
  const filePath = join(pagesDir, `${name}${meta.extension}`);

  if (!existsSync(pagesDir)) {
    mkdirSync(pagesDir, { recursive: true });
  }

  // Ensure CSS exists in the shared styles directory regardless of whether
  // the page file was already copied from a template. The build scans
  // stylesConfig for .css files and produces <PascalName>CSS manifest keys.
  if (stylesDirectory && !meta.usesInlineCSS && meta.cssTemplate) {
    const cssName = `${toKebab(name)}.css`;
    const cssPath = join(stylesDirectory, cssName);
    if (!existsSync(cssPath)) {
      mkdirSync(stylesDirectory, { recursive: true });
      await Bun.write(cssPath, meta.cssTemplate(name));
    }
  }

  // If the file already exists, don't overwrite
  if (existsSync(filePath)) return filePath;

  // Generate a new page from the framework template
  await Bun.write(filePath, meta.pageTemplate(name));

  // Write HTML template file for frameworks that use external templateUrl.
  // Written after the page file so the template always matches the generated
  // page code (overwriting any file copied from the scaffold template).
  if (meta.htmlTemplate) {
    const templatesDir = join(directory, "templates");
    mkdirSync(templatesDir, { recursive: true });
    await Bun.write(
      join(templatesDir, `${toKebab(name)}.html`),
      meta.htmlTemplate(name),
    );
  }

  return filePath;
};

// ── Full framework scaffolding ────────────────────────────────

/**
 * Resolve the path to the absolutejs-project template directory.
 * Looks for create-absolutejs as a sibling of the studio package,
 * or falls back to an explicit templateDir if provided.
 */
const resolveTemplateDir = (explicitDir?: string): string | null => {
  if (explicitDir && existsSync(explicitDir)) return explicitDir;

  // Walk up from this file to find the monorepo root
  const candidates = [
    resolve(__dirname, "../../create-absolutejs/absolutejs-project"),
    resolve(__dirname, "../../../create-absolutejs/absolutejs-project"),
    resolve(process.cwd(), "../create-absolutejs/absolutejs-project"),
  ];

  for (const candidate of candidates) {
    if (existsSync(join(candidate, "src", "frontend"))) return candidate;
  }

  return null;
};

/**
 * Copy the full framework directory from the template project.
 */
const copyFrameworkTemplate = (
  framework: StudioFramework,
  frameworkDir: string,
  templateDir: string,
) => {
  const src = join(templateDir, "src", "frontend", framework);
  if (!existsSync(src)) return;

  cpSync(src, frameworkDir, {
    recursive: true,
    filter: (source) => {
      // Skip Angular compiled directory
      if (framework === "angular" && source.includes("/compiled")) return false;
      // Skip pages/ and styles/ — Studio generates these via createPageFile
      // to ensure the page template and route code stay in sync.
      if (source.includes("/pages")) return false;
      if (source.includes("/styles")) return false;
      return true;
    },
  });
};

/**
 * Ensure shared styles (reset.css) exist in the project.
 */
const ensureSharedStyles = (frameworkDir: string, templateDir: string) => {
  // Place shared styles at the parent level of the framework directory
  // e.g., if frameworkDir is src/frontend/react, styles go in src/frontend/styles
  const dest = join(dirname(frameworkDir), "styles");
  const resetDest = join(dest, "reset.css");

  if (existsSync(resetDest)) return;

  const src = join(templateDir, "src", "frontend", "styles");
  if (existsSync(src)) {
    cpSync(src, dest, { recursive: true });
  }
};

/**
 * Add framework dependencies to package.json and run bun install.
 */
const installFrameworkDeps = async (
  framework: StudioFramework,
  projectDir: string,
  templateDir?: string | null,
) => {
  const meta = getFrameworkMeta(framework);
  if (meta.dependencies.length === 0 && meta.devDependencies.length === 0) {
    return;
  }

  const pkgPath = join(projectDir, "package.json");
  const pkgContent = await Bun.file(pkgPath).text();
  const pkg = JSON.parse(pkgContent) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  // Read versions from the template package.json
  let templateVersions: Record<string, string> = {};
  const templatePkgPath = templateDir
    ? join(templateDir, "package.json")
    : null;
  if (templatePkgPath && existsSync(templatePkgPath)) {
    const templatePkg = JSON.parse(await Bun.file(templatePkgPath).text()) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    templateVersions = {
      ...templatePkg.dependencies,
      ...templatePkg.devDependencies,
    };
  }

  let changed = false;

  if (!pkg.dependencies) pkg.dependencies = {};
  for (const dep of meta.dependencies) {
    if (!pkg.dependencies[dep]) {
      pkg.dependencies[dep] = templateVersions[dep] ?? "latest";
      changed = true;
    }
  }

  if (!pkg.devDependencies) pkg.devDependencies = {};
  for (const dep of meta.devDependencies) {
    if (!pkg.devDependencies[dep]) {
      pkg.devDependencies[dep] = templateVersions[dep] ?? "latest";
      changed = true;
    }
  }

  if (!changed) return;

  await Bun.write(pkgPath, JSON.stringify(pkg, null, "\t") + "\n");

  const proc = Bun.spawn(["bun", "install"], {
    cwd: projectDir,
    stdout: "pipe",
    stderr: "pipe",
  });
  await proc.exited;
};

/**
 * Create the vueImporter utility when both Vue and Svelte coexist.
 * Their SFC types overlap, so Vue imports go through this indirection file.
 */
const ensureVueImporter = async (
  projectDir: string,
  scanConfig?: ProjectConfig,
) => {
  // Find the server file to place utils relative to it
  const serverPath = findServerFile(projectDir);
  const serverDir = serverPath
    ? dirname(serverPath)
    : join(projectDir, "src", "backend");
  const utilsDir = join(serverDir, "utils");

  const importerPath = join(utilsDir, "vueImporter.ts");
  if (existsSync(importerPath)) return;

  mkdirSync(utilsDir, { recursive: true });

  // Derive the vue directory from config
  const vueDir =
    scanConfig?.vueDirectory ??
    deriveFrameworkDirectory("vue", projectDir, scanConfig);
  const relPath = computeRelativeDir(utilsDir, vueDir);

  // Scan for Vue page components to include in the importer
  const imports: string[] = [];
  const exports: string[] = [];

  const pagesDir = join(vueDir, "pages");
  if (existsSync(pagesDir)) {
    const glob = new Glob("*.vue");
    for await (const match of glob.scan({ cwd: pagesDir })) {
      const name = match.replace(/\.vue$/, "");
      imports.push(`import ${name} from '${relPath}/pages/${match}';`);
      exports.push(name);
    }
  }

  if (imports.length === 0) {
    imports.push(`import VueExample from '${relPath}/pages/VueExample.vue';`);
    exports.push("VueExample");
  }

  const content = `${imports.join("\n")}\n\nexport const vueImports = { ${exports.join(", ")} } as const;\n`;
  await Bun.write(importerPath, content);
};

/** Find the vueImporter.ts file path (relative to the server file). */
const findVueImporterPath = (projectDir: string): string | null => {
  const serverPath = findServerFile(projectDir);
  const serverDir = serverPath
    ? dirname(serverPath)
    : join(projectDir, "src", "backend");
  const importerPath = join(serverDir, "utils", "vueImporter.ts");
  return existsSync(importerPath) ? importerPath : null;
};

/**
 * Remove a page from vueImporter.ts. If no pages remain, delete the file.
 */
const removeFromVueImporter = async (
  pageName: string,
  projectDir: string,
): Promise<void> => {
  const importerPath = findVueImporterPath(projectDir);
  if (!importerPath) return;

  let content = await Bun.file(importerPath).text();

  // Remove the import line for this page
  const lines = content.split("\n");
  const filtered = lines.filter(
    (line) => !(line.startsWith("import ") && line.includes(` ${pageName} `)),
  );
  content = filtered.join("\n");

  // Update the exports object — remove this page name
  content = content.replace(
    /export const vueImports = \{([^}]+)\} as const;/,
    (match, inner: string) => {
      const names = inner
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n && n !== pageName);
      if (names.length === 0) return match; // will be deleted below
      return `export const vueImports = { ${names.join(", ")} } as const;`;
    },
  );

  // Check if any imports remain
  const hasImports = content.split("\n").some((l) => l.startsWith("import "));
  if (!hasImports) {
    // No more pages — delete the importer
    unlinkSync(importerPath);
    return;
  }

  await Bun.write(importerPath, content);
};

/**
 * Delete vueImporter.ts entirely.
 */
const deleteVueImporter = (projectDir: string): void => {
  const importerPath = findVueImporterPath(projectDir);
  if (importerPath) unlinkSync(importerPath);
};

/**
 * When svelte is removed and vue still exists, convert vue routes in server.ts
 * from vueImporter indirection (`vueImports.X`) to direct imports, then delete
 * vueImporter.ts.
 */
const convertVueRoutesToDirectImports = async (
  projectDir: string,
  scanConfig?: ProjectConfig,
): Promise<void> => {
  const serverPath = findServerFile(projectDir);
  if (!serverPath) return;

  let content = await Bun.file(serverPath).text();

  // Check if server.ts actually uses vueImports
  if (!content.includes("vueImports.")) {
    deleteVueImporter(projectDir);
    return;
  }

  // Find all vueImports.X references and collect the component names
  const vueImportRefs = [...content.matchAll(/vueImports\.(\w+)/g)];
  const componentNames = [...new Set(vueImportRefs.map((m) => m[1]!))];

  // Determine the vue directory for import paths
  const vueDir =
    scanConfig?.vueDirectory ??
    deriveFrameworkDirectory("vue", projectDir, scanConfig);
  const relDir = computeRelativeDir(dirname(serverPath), vueDir);

  // Replace vueImports.X with just X in route code
  for (const name of componentNames) {
    content = content.replaceAll(`vueImports.${name}`, name);
  }

  // Remove the vueImporter import line
  content = content
    .split("\n")
    .filter((line) => !line.includes("vueImporter"))
    .join("\n");

  // Add direct imports for each component
  const lines = content.split("\n");
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]!.startsWith("import ")) lastImportIndex = i;
  }

  if (lastImportIndex >= 0) {
    const newImports = componentNames
      .filter((name) => {
        // Only add if not already directly imported
        return !content.includes(`import ${name} from`);
      })
      .map((name) => `import ${name} from '${relDir}/pages/${name}.vue';`);
    if (newImports.length > 0) {
      lines.splice(lastImportIndex + 1, 0, ...newImports);
    }
  }

  content = lines.join("\n");
  content = content.replace(/\n{3,}/g, "\n\n");
  await Bun.write(serverPath, content);

  // Delete vueImporter.ts
  deleteVueImporter(projectDir);
};

/**
 * When svelte is added to a project that already has vue with direct imports,
 * convert vue routes in server.ts from direct imports to vueImporter indirection.
 * This avoids TypeScript SFC type conflicts between .vue and .svelte files.
 */
const convertVueRoutesToVueImporter = async (
  projectDir: string,
  scanConfig?: ProjectConfig,
): Promise<void> => {
  const serverPath = findServerFile(projectDir);
  if (!serverPath) return;

  let content = await Bun.file(serverPath).text();

  // Already using vueImporter — nothing to do
  if (content.includes("vueImports.")) return;

  // Find direct vue component imports: `import X from '.../<something>.vue'`
  const vueImportRe =
    /^import\s+(\w+)\s+from\s+['"][^'"]*\/pages\/\w+\.vue['"];?\s*$/gm;
  const directImports = [...content.matchAll(vueImportRe)];
  if (directImports.length === 0) return;

  const componentNames = directImports.map((m) => m[1]!);

  // Replace direct component references in route code with vueImports.X
  for (const name of componentNames) {
    // Only replace in handler calls, not in import lines.
    // Match the component name when it appears as a standalone identifier
    // in a handler context (after a newline+tabs, as the first arg).
    content = content.replace(
      new RegExp(`(handleVuePageRequest\\(\\s*\\n\\s*)${name}\\b`, "g"),
      `$1vueImports.${name}`,
    );
    // Also handle single-line patterns like handleVuePageRequest(Name,
    content = content.replace(
      new RegExp(`(handleVuePageRequest\\(\\s*)${name}\\b`, "g"),
      `$1vueImports.${name}`,
    );
  }

  // Remove the direct .vue import lines
  const lines = content.split("\n");
  const filtered = lines.filter(
    (line) => !vueImportRe.test(line.trimStart() + "\n"),
  );

  // Re-test with fresh regex since lastIndex is stateful
  content = lines
    .filter((line) => {
      const trimmed = line.trimStart();
      if (!trimmed.startsWith("import ")) return true;
      return !trimmed.match(
        /^import\s+\w+\s+from\s+['"][^'"]*\/pages\/\w+\.vue['"];?\s*$/,
      );
    })
    .join("\n");

  // Add vueImporter import if not already present
  if (!content.includes("vueImporter")) {
    const importLines = content.split("\n");
    let lastImportIdx = -1;
    for (let i = 0; i < importLines.length; i++) {
      if (importLines[i]!.startsWith("import ")) lastImportIdx = i;
    }
    if (lastImportIdx >= 0) {
      importLines.splice(
        lastImportIdx + 1,
        0,
        `import { vueImports } from './utils/vueImporter';`,
      );
      content = importLines.join("\n");
    }
  }

  content = content.replace(/\n{3,}/g, "\n\n");
  await Bun.write(serverPath, content);
};

/**
 * Compute a relative path from one directory to another.
 */
const computeRelativeDir = (fromDir: string, toDir: string): string => {
  const fromParts = resolve(fromDir).split("/");
  const toParts = resolve(toDir).split("/");
  let common = 0;
  while (
    common < fromParts.length &&
    common < toParts.length &&
    fromParts[common] === toParts[common]
  ) {
    common++;
  }
  const ups = fromParts.length - common;
  const downs = toParts.slice(common);
  return (ups > 0 ? "../".repeat(ups) : "./") + downs.join("/");
};

/**
 * Add a page route + imports to the user's server.ts.
 */
export const addPageRoute = async (
  pageName: string,
  routePath: string,
  framework: StudioFramework,
  projectDir: string,
  frameworkDir: string,
  ctx?: FrameworkContext,
) => {
  const meta = getFrameworkMeta(framework);
  const serverPath = findServerFile(projectDir);
  if (!serverPath) return;

  let content = await Bun.file(serverPath).text();

  // Check if route already exists
  if (
    content.includes(`'${routePath}'`) ||
    content.includes(`"${routePath}"`)
  ) {
    return;
  }

  const relDir = computeRelativeDir(dirname(serverPath), frameworkDir);

  const params = { name: pageName, route: routePath, dir: relDir, ctx };

  // Add imports — find the last import line
  const neededImports = meta.pageImports(params);
  const lines = content.split("\n");
  let lastImportIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i]!.startsWith("import ")) {
      lastImportIndex = i;
    }
  }

  // Filter out imports that already exist
  const newImports = neededImports.filter((imp) => {
    const match = imp.match(/import\s+\{?\s*([^}]+)\}?\s+from/);
    if (match) {
      const names = match[1]!.split(",").map((n) => n.trim());
      return !names.every((name) => content.includes(name));
    }
    return !content.includes(imp);
  });

  if (newImports.length > 0 && lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, ...newImports);
  }

  content = lines.join("\n");

  // HTMX needs scopedState middleware
  if (framework === "htmx" && !content.includes(".use(scopedState")) {
    content = content.replace(
      /\.use\(absolutejs\)/,
      ".use(absolutejs)\n\t.use(scopedState({ count: { value: 0 } }))",
    );
  }

  // Add the route — find insertion point before .use(networking) or .on('error'
  const routeCode = meta.pageRouteCode(params);
  const anchorPatterns = [
    /\n(\t*)\.use\(networking\)/,
    /\n(\t*)\.on\(['"]error['"]/,
  ];

  let inserted = false;
  for (const pattern of anchorPatterns) {
    const match = content.match(pattern);
    if (match && match.index != null) {
      content =
        content.slice(0, match.index) +
        "\n" +
        routeCode +
        content.slice(match.index);
      inserted = true;
      break;
    }
  }

  if (!inserted) {
    const lastSemicolon = content.lastIndexOf(";");
    if (lastSemicolon > 0) {
      content =
        content.slice(0, lastSemicolon) +
        "\n" +
        routeCode +
        content.slice(lastSemicolon);
    }
  }

  await Bun.write(serverPath, content);
};

/**
 * Update absolute.config.ts with the new framework directory.
 */
export const updateAbsoluteConfig = async (
  framework: StudioFramework,
  projectDir: string,
  frameworkDir: string,
) => {
  const meta = getFrameworkMeta(framework);
  const configPath = join(projectDir, "absolute.config.ts");
  const relativePath = frameworkDir
    .replace(projectDir + "/", "")
    .replace(projectDir + "\\", "");

  if (!existsSync(configPath)) return;

  const configContent = await Bun.file(configPath).text();

  // Check if already configured
  if (configContent.includes(`${meta.configKey}:`)) return;

  // Insert before the closing })
  const lines = configContent.split("\n");
  let insertIndex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i]!.trim();
    if (
      line.includes("Directory:") ||
      line.includes("publicDirectory:") ||
      line.includes("buildDirectory:") ||
      line.includes("assetsDirectory:")
    ) {
      // Ensure trailing comma
      if (!lines[i]!.trimEnd().endsWith(",")) {
        lines[i] = lines[i]!.replace(/(\S)\s*$/, "$1,");
      }
      insertIndex = i + 1;
      break;
    }
  }

  if (insertIndex !== -1) {
    const prevLine = lines[insertIndex - 1] ?? "";
    const indent = prevLine.match(/^(\s*)/)?.[1] ?? "\t";
    lines.splice(
      insertIndex,
      0,
      `${indent}${meta.configKey}: '${relativePath}',`,
    );
    await Bun.write(configPath, lines.join("\n"));
  }
};

/**
 * Full framework scaffolding — copies templates, installs deps,
 * adds routes, and updates config.
 */
/**
 * Derive where a new framework directory should go based on existing config.
 * Reads the layout from already-configured frameworks so nothing is hardcoded.
 */
const deriveFrameworkDirectory = (
  framework: StudioFramework,
  projectDir: string,
  scanConfig?: ProjectConfig,
): string => {
  const configured = getConfiguredFrameworks(scanConfig ?? {});

  if (configured.length > 0) {
    // Use existing directories to determine the convention.
    // If an existing dir ends with its framework name (e.g., .../react),
    // the project uses per-framework subfolders → sibling for the new one.
    // Otherwise the project uses a flat layout — new framework goes as a subfolder.
    const existing = configured[0]!;
    const dirBasename = basename(existing.directory);

    if (dirBasename === existing.framework) {
      // e.g., /project/src/frontend/react → parent is /project/src/frontend
      return join(dirname(existing.directory), framework);
    }
    // Flat layout — existing dir IS the frontend root, new framework goes inside
    return join(existing.directory, framework);
  }

  // No existing frameworks — try to find a convention from the config file
  // Fall back to: <projectDir>/src/frontend/<framework>
  // but check common locations first
  const candidates = [
    join(projectDir, "src", "frontend", framework),
    join(projectDir, "frontend", framework),
    join(projectDir, "src", framework),
  ];
  for (const candidate of candidates) {
    const parent = dirname(candidate);
    if (existsSync(parent)) return candidate;
  }
  return candidates[0]!;
};

/**
 * Scaffold a framework — copies templates, installs deps, updates config.
 * Does NOT add any routes (that happens when creating a page).
 */
export const addFramework = async (
  framework: StudioFramework,
  projectDir: string,
  templateDir?: string,
  scanConfig?: ProjectConfig,
  options?: { skipConfigUpdate?: boolean },
): Promise<{ directory: string }> => {
  const frameworkDir = deriveFrameworkDirectory(
    framework,
    projectDir,
    scanConfig,
  );

  // Resolve template directory
  const resolvedTemplateDir = resolveTemplateDir(templateDir);

  if (resolvedTemplateDir) {
    // 1. Copy the full framework template (components, styles, etc.)
    copyFrameworkTemplate(framework, frameworkDir, resolvedTemplateDir);

    // 2. Ensure shared styles exist
    ensureSharedStyles(frameworkDir, resolvedTemplateDir);
  }

  // Always ensure the pages directory exists — copyFrameworkTemplate skips
  // pages/ so Studio can generate them via createPageFile instead.
  mkdirSync(join(frameworkDir, "pages"), { recursive: true });

  // 3. Install dependencies (always, even without a template dir —
  //    installFrameworkDeps falls back to "latest" for missing versions)
  await installFrameworkDeps(framework, projectDir, resolvedTemplateDir);

  // 3b. Vue needs a type shim so TypeScript can resolve .vue imports
  if (framework === "vue") {
    const typesDir = join(projectDir, "types");
    const shimPath = join(typesDir, "vue-shim.d.ts");
    if (!existsSync(shimPath)) {
      mkdirSync(typesDir, { recursive: true });
      await Bun.write(
        shimPath,
        `declare module '*.vue' {\n\timport type { Component } from 'vue';\n\n\tconst component: Component<Record<never, never>>;\n\texport default component;\n}\n`,
      );
    }
  }

  // 4. Vue + Svelte coexistence needs vueImporter
  const hasSvelte = !!scanConfig?.svelteDirectory || framework === "svelte";
  const hasVue = !!scanConfig?.vueDirectory || framework === "vue";
  if (hasSvelte && hasVue) {
    await ensureVueImporter(projectDir, scanConfig);
    // If adding svelte to existing vue, convert direct vue imports to vueImporter
    if (framework === "svelte" && scanConfig?.vueDirectory) {
      await convertVueRoutesToVueImporter(projectDir, scanConfig);
    }
  }

  // 5. Svelte needs prettier-plugin-svelte for formatting
  if (framework === "svelte") {
    await addSveltePrettierConfig(projectDir);
  }

  // 6. Update absolute.config.ts (HMR will rebuild manifest for new directory)
  //    When called from page-creation, the caller can skip this to batch the
  //    config change with the route addition — avoiding an intermediate rebuild
  //    that would disrupt the currently-loaded page in the preview.
  if (!options?.skipConfigUpdate) {
    await updateAbsoluteConfig(framework, projectDir, frameworkDir);
  }

  return { directory: frameworkDir };
};

// ── Prettier config management ─────────────────────────────────

/**
 * Add the prettier-plugin-svelte plugin and parser override to .prettierrc.json.
 */
const addSveltePrettierConfig = async (projectDir: string) => {
  const configPath = join(projectDir, ".prettierrc.json");
  if (!existsSync(configPath)) return;

  const config = JSON.parse(await Bun.file(configPath).text()) as {
    plugins?: string[];
    overrides?: { files: string; options: Record<string, string> }[];
    [key: string]: unknown;
  };

  let changed = false;

  // Add plugin
  if (!config.plugins) config.plugins = [];
  if (!config.plugins.includes("prettier-plugin-svelte")) {
    config.plugins.push("prettier-plugin-svelte");
    changed = true;
  }

  // Add svelte parser override
  if (!config.overrides) config.overrides = [];
  const hasSvelteOverride = config.overrides.some(
    (o) => o.files === "*.svelte",
  );
  if (!hasSvelteOverride) {
    config.overrides.push({ files: "*.svelte", options: { parser: "svelte" } });
    changed = true;
  }

  if (changed) {
    await Bun.write(configPath, JSON.stringify(config, null, "\t") + "\n");
  }
};

/**
 * Remove the prettier-plugin-svelte plugin and parser override from .prettierrc.json.
 */
const removeSveltePrettierConfig = async (projectDir: string) => {
  const configPath = join(projectDir, ".prettierrc.json");
  if (!existsSync(configPath)) return;

  const config = JSON.parse(await Bun.file(configPath).text()) as {
    plugins?: string[];
    overrides?: { files: string; options: Record<string, string> }[];
    [key: string]: unknown;
  };

  let changed = false;

  // Remove plugin
  if (config.plugins) {
    const idx = config.plugins.indexOf("prettier-plugin-svelte");
    if (idx !== -1) {
      config.plugins.splice(idx, 1);
      changed = true;
    }
    if (config.plugins.length === 0) delete config.plugins;
  }

  // Remove svelte parser override
  if (config.overrides) {
    const idx = config.overrides.findIndex((o) => o.files === "*.svelte");
    if (idx !== -1) {
      config.overrides.splice(idx, 1);
      changed = true;
    }
    if (config.overrides.length === 0) delete config.overrides;
  }

  if (changed) {
    await Bun.write(configPath, JSON.stringify(config, null, "\t") + "\n");
  }
};

// ── Source editing / types ────────────────────────────────────

export const readPageSource = async (filePath: string) => {
  return Bun.file(filePath).text();
};

export const writePageSource = async (filePath: string, content: string) => {
  await Bun.write(filePath, content);
};

/**
 * Minimal csstype stub — the full file is 22K lines / 895KB and will
 * choke the Monaco TS worker.  We only need the `Properties` interface
 * so React's `CSSProperties` resolves.
 */
const CSSTYPE_STUB = `declare module "csstype" {
  export interface Properties<TLength = (string & {}) | 0, TTime = string & {}> {
    [key: string]: any;
  }
  export interface PropertiesHyphen<TLength = (string & {}) | 0, TTime = string & {}> {
    [key: string]: any;
  }
}
`;

const VUE_STUB = `// Wildcard module declaration so .vue imports resolve without error
declare module '*.vue' {
  import type { Component } from 'vue';
  const component: Component;
  export default component;
}

// Vue compiler macros — these are globals in <script setup>, not imports

/**
 * Vue \`<script setup>\` compiler macro for declaring component props.
 * The expected argument is the same as the component \`props\` option.
 *
 * Example runtime declaration:
 * \`\`\`js
 * // using Array syntax
 * const props = defineProps(['foo', 'bar'])
 * // using Object syntax
 * const props = defineProps({ foo: String, bar: { type: Number, required: true } })
 * \`\`\`
 *
 * Equivalent of \`props\` option in Options API.
 *
 * @see https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits
 */
declare function defineProps<T extends Record<string, any>>(): Readonly<T>;

/**
 * Vue \`<script setup>\` compiler macro for providing props default values
 * when using type-based \`defineProps\` declaration.
 *
 * @see https://vuejs.org/api/sfc-script-setup.html#default-props-values-when-using-type-declaration
 */
declare function withDefaults<T extends Record<string, any>>(props: T, defaults: Partial<T>): T;

/**
 * Vue \`<script setup>\` compiler macro for declaring emitted events.
 *
 * @see https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits
 */
declare function defineEmits<T extends Record<string, any[]>>(): { (event: string, ...args: any[]): void };

/**
 * Vue \`<script setup>\` compiler macro for declaring component public instance properties.
 *
 * @see https://vuejs.org/api/sfc-script-setup.html#defineexpose
 */
declare function defineExpose(exposed?: Record<string, any>): void;

/**
 * Vue \`<script setup>\` compiler macro for declaring a two-way binding prop
 * that can be consumed via \`v-model\` from the parent component.
 *
 * @see https://vuejs.org/api/sfc-script-setup.html#definemodel
 */
declare function defineModel<T>(name?: string, options?: any): import('vue').Ref<T>;

/**
 * Vue \`<script setup>\` compiler macro for declaring expected slots.
 *
 * @see https://vuejs.org/api/sfc-script-setup.html#defineslots
 */
declare function defineSlots<T>(): T;

/**
 * Vue \`<script setup>\` compiler macro for declaring component options.
 *
 * @see https://vuejs.org/api/sfc-script-setup.html#defineoptions
 */
declare function defineOptions(options: Record<string, any>): void;

declare module "vue" {
  export interface Ref<T = any> { value: T; }

  /**
   * Takes an inner value and returns a reactive and mutable ref object, which
   * has a single property \`.value\` that points to the inner value.
   *
   * @param value - The object to wrap in the ref.
   *
   * @see https://vuejs.org/api/reactivity-core.html#ref
   */
  export function ref<T = undefined>(value?: T): Ref<T>;

  /**
   * Returns a reactive proxy of the object.
   *
   * @see https://vuejs.org/api/reactivity-core.html#reactive
   */
  export function reactive<T extends object>(target: T): T;

  /**
   * Takes a getter function and returns a readonly reactive ref object for the
   * returned value from the getter. It can also take an object with get and set
   * functions to create a writable ref object.
   *
   * @see https://vuejs.org/api/reactivity-core.html#computed
   */
  export function computed<T>(getter: () => T): Readonly<Ref<T>>;
  export function computed<T>(options: { get: () => T; set: (v: T) => void }): Ref<T>;
  export function watch(source: any, cb: Function, options?: { immediate?: boolean; deep?: boolean; flush?: string }): () => void;
  export function watchEffect(effect: () => void, options?: { flush?: string }): () => void;
  export function watchPostEffect(effect: () => void): () => void;
  export function watchSyncEffect(effect: () => void): () => void;
  export function onMounted(hook: () => void): void;
  export function onUnmounted(hook: () => void): void;
  export function onBeforeMount(hook: () => void): void;
  export function onBeforeUnmount(hook: () => void): void;
  export function onUpdated(hook: () => void): void;
  export function onBeforeUpdate(hook: () => void): void;
  export function onActivated(hook: () => void): void;
  export function onDeactivated(hook: () => void): void;
  export function onErrorCaptured(hook: (err: Error, instance: any, info: string) => boolean | void): void;
  export function defineProps<T extends Record<string, any>>(): Readonly<T>;
  export function withDefaults<T extends Record<string, any>>(props: T, defaults: Partial<T>): T;
  export function defineEmits<T extends Record<string, any[]>>(): { (event: string, ...args: any[]): void };
  export function defineExpose(exposed?: Record<string, any>): void;
  export function defineModel<T>(name?: string, options?: any): Ref<T>;
  export function defineSlots<T>(): T;
  export function defineOptions(options: Record<string, any>): void;
  export function nextTick(fn?: () => void): Promise<void>;
  export function inject<T>(key: string | symbol): T | undefined;
  export function inject<T>(key: string | symbol, defaultValue: T): T;
  export function provide(key: string | symbol, value: any): void;
  export function toRefs<T extends object>(object: T): { [K in keyof T]: Ref<T[K]> };
  export function toRef<T extends object, K extends keyof T>(object: T, key: K): Ref<T[K]>;
  export function toRef<T>(value: T): Ref<T>;
  export function unref<T>(ref: Ref<T> | T): T;
  export function isRef<T>(value: Ref<T> | unknown): value is Ref<T>;
  export function shallowRef<T = undefined>(value?: T): Ref<T>;
  export function triggerRef(ref: Ref): void;
  export function customRef<T>(factory: (track: () => void, trigger: () => void) => { get: () => T; set: (value: T) => void }): Ref<T>;
  export function readonly<T extends object>(target: T): Readonly<T>;
  export function shallowReactive<T extends object>(target: T): T;
  export function shallowReadonly<T extends object>(target: T): Readonly<T>;
  export function toRaw<T>(observed: T): T;
  export function markRaw<T extends object>(value: T): T;
  export function effectScope(detached?: boolean): { run<T>(fn: () => T): T; stop(): void };
  export function getCurrentScope(): any;
  export function onScopeDispose(fn: () => void): void;
  export interface Component {}
  export interface App<T = any> { mount(el: string | Element): any; unmount(): void; use(plugin: any, ...options: any[]): App<T>; component(name: string, comp?: Component): any; directive(name: string, dir?: any): any; provide(key: string | symbol, value: any): App<T>; }
  export function createApp(rootComponent: Component, rootProps?: Record<string, any>): App;
  export function h(type: any, props?: any, children?: any): any;
  export function resolveComponent(name: string): any;
  export function resolveDirective(name: string): any;
  export function useSlots(): any;
  export function useAttrs(): Record<string, any>;
}
`;

const SVELTE_STUB = `// Wildcard module declaration so .svelte imports resolve without error
declare module '*.svelte' {
  const component: any;
  export default component;
}

// Svelte 5 runes — these are compiler intrinsics, declared globally

/**
 * Declares reactive state.
 *
 * Example:
 * \`\`\`js
 * let count = $state(0);
 * \`\`\`
 *
 * @see https://svelte.dev/docs/svelte/$state
 */
declare function $state<T>(value: T): T;
declare function $state<T>(): T | undefined;
declare namespace $state {
  /**
   * Declares reactive read-only state. Changes to the value will cause a compiler error.
   *
   * @see https://svelte.dev/docs/svelte/$state#$state.frozen
   */
  export function frozen<T>(value: T): Readonly<T>;
  export function frozen<T>(): Readonly<T> | undefined;
  /**
   * To take a static snapshot of a deeply reactive \`$state\` proxy, use \`$state.snapshot\`.
   *
   * @see https://svelte.dev/docs/svelte/$state#$state.snapshot
   */
  export function snapshot<T>(state: T): T;
}

/**
 * Declares derived state, i.e. one that depends on other state variables.
 * The expression inside \`$derived(...)\` should be free of side-effects.
 *
 * Example:
 * \`\`\`js
 * let doubled = $derived(count * 2);
 * \`\`\`
 *
 * @see https://svelte.dev/docs/svelte/$derived
 */
declare function $derived<T>(expression: T): T;
declare namespace $derived {
  /**
   * Sometimes you need to create complex derivations that don't fit inside a short expression.
   * In these cases, you can use \`$derived.by\` which accepts a function as its argument.
   *
   * @see https://svelte.dev/docs/svelte/$derived#$derived.by
   */
  export function by<T>(fn: () => T): T;
}

/**
 * Runs code when a component is mounted, or when its dependencies change. The function
 * passed to \`$effect\` will run after the DOM has been updated.
 *
 * Example:
 * \`\`\`js
 * $effect(() => {
 *   console.log(count);
 * });
 * \`\`\`
 *
 * @see https://svelte.dev/docs/svelte/$effect
 */
declare function $effect(fn: () => void | (() => void)): void;
declare namespace $effect {
  /**
   * Runs code right before the DOM is updated. Useful when you need to do manual DOM manipulation.
   *
   * @see https://svelte.dev/docs/svelte/$effect#$effect.pre
   */
  export function pre(fn: () => void | (() => void)): void;
  /**
   * Returns whether the current code is running inside a tracking context (an effect or a template).
   *
   * @see https://svelte.dev/docs/svelte/$effect#$effect.tracking
   */
  export function tracking(): boolean;
  /**
   * Creates a non-tracked scope that doesn't auto-cleanup.
   *
   * @see https://svelte.dev/docs/svelte/$effect#$effect.root
   */
  export function root(fn: () => void | (() => void)): () => void;
}

/**
 * Declares the props that a component accepts. Example:
 *
 * \`\`\`js
 * let { optionalProp = 42, requiredProp, bindableProp = $bindable() }: {
 *   optionalProp?: number;
 *   requiredProp: string;
 *   bindableProp: boolean;
 * } = $props();
 * \`\`\`
 *
 * @see https://svelte.dev/docs/svelte/$props
 */
declare function $props<T extends Record<string, any>>(): T;

/**
 * Declares a prop as bindable, meaning the parent component can use \`bind:\` with it.
 *
 * @see https://svelte.dev/docs/svelte/$bindable
 */
declare function $bindable<T>(value?: T): T;

/**
 * Inspects one or more values whenever they, or the properties they contain, change.
 * \`$inspect\` only works during development.
 *
 * Example:
 * \`\`\`js
 * $inspect(count).with(console.trace);
 * \`\`\`
 *
 * @see https://svelte.dev/docs/svelte/$inspect
 */
declare function $inspect<T extends any[]>(...values: T): { with(fn: (type: string, ...values: T) => void): void };

/**
 * Retrieves the \`this\` reference of the custom element that contains this component.
 * Only available inside custom element components.
 *
 * @see https://svelte.dev/docs/svelte/$host
 */
declare function $host(): HTMLElement;

declare module "svelte" {
  export function onMount(fn: () => void | (() => void)): void;
  export function onDestroy(fn: () => void): void;
  export function beforeUpdate(fn: () => void): void;
  export function afterUpdate(fn: () => void): void;
  export function tick(): Promise<void>;
  export function createEventDispatcher<T = any>(): (type: string, detail?: T) => void;
  export function setContext<T>(key: any, context: T): T;
  export function getContext<T>(key: any): T;
  export function getAllContexts(): Map<any, any>;
  export function hasContext(key: any): boolean;
  export function mount(component: any, options: { target: Element; props?: Record<string, any>; intro?: boolean }): any;
  export function unmount(component: any): void;
  export function untrack<T>(fn: () => T): T;
  export function flushSync(fn?: () => void): void;
}
declare module "svelte/store" {
  export interface Readable<T> { subscribe(run: (value: T) => void): () => void; }
  export interface Writable<T> extends Readable<T> { set(value: T): void; update(fn: (value: T) => T): void; }
  export function writable<T>(value: T, start?: (set: (value: T) => void) => void | (() => void)): Writable<T>;
  export function readable<T>(value: T, start?: (set: (value: T) => void) => void | (() => void)): Readable<T>;
  export function derived<T>(stores: Readable<any> | Readable<any>[], fn: Function, initial_value?: T): Readable<T>;
  export function get<T>(store: Readable<T>): T;
  export function readonly<T>(store: Readable<T>): Readable<T>;
}
declare module "svelte/transition" {
  interface TransitionConfig { delay?: number; duration?: number; easing?: (t: number) => number; css?: (t: number, u: number) => string; tick?: (t: number, u: number) => void; }
  export function fade(node: Element, params?: { delay?: number; duration?: number; easing?: (t: number) => number }): TransitionConfig;
  export function fly(node: Element, params?: { delay?: number; duration?: number; easing?: (t: number) => number; x?: number; y?: number; opacity?: number }): TransitionConfig;
  export function slide(node: Element, params?: { delay?: number; duration?: number; easing?: (t: number) => number; axis?: "x" | "y" }): TransitionConfig;
  export function scale(node: Element, params?: { delay?: number; duration?: number; easing?: (t: number) => number; start?: number; opacity?: number }): TransitionConfig;
  export function blur(node: Element, params?: { delay?: number; duration?: number; easing?: (t: number) => number; amount?: number; opacity?: number }): TransitionConfig;
  export function draw(node: SVGElement, params?: { delay?: number; duration?: number; easing?: (t: number) => number; speed?: number }): TransitionConfig;
  export function crossfade(params?: { delay?: number; duration?: number; easing?: (t: number) => number; fallback?: (node: Element, params: any) => TransitionConfig }): [(node: Element, params: any) => TransitionConfig, (node: Element, params: any) => TransitionConfig];
}
declare module "svelte/motion" {
  import type { Readable } from "svelte/store";
  export interface Tweened<T> extends Readable<T> { set(value: T, opts?: { delay?: number; duration?: number; easing?: (t: number) => number; interpolate?: (a: T, b: T) => (t: number) => T }): Promise<void>; update(fn: (value: T) => T, opts?: any): Promise<void>; }
  export interface Spring<T> extends Readable<T> { set(value: T, opts?: { hard?: boolean; soft?: boolean | number }): Promise<void>; update(fn: (value: T) => T, opts?: any): Promise<void>; stiffness: number; damping: number; precision: number; }
  export function tweened<T>(value?: T, defaults?: any): Tweened<T>;
  export function spring<T>(value?: T, opts?: { stiffness?: number; damping?: number; precision?: number }): Spring<T>;
}
declare module "svelte/animate" {
  export function flip(node: Element, from: DOMRect, params?: { delay?: number; duration?: number | ((len: number) => number); easing?: (t: number) => number }): any;
}
`;

export const getTypeDefinitions = async () => {
  const result: Record<string, string> = {};

  /** Try to read a type file; silently skip if it doesn't exist. */
  const tryLoad = async (nodeModulePath: string, key?: string) => {
    try {
      const content = await Bun.file(`node_modules/${nodeModulePath}`).text();
      result[key ?? nodeModulePath] = content;
    } catch {
      // Package not installed — skip
    }
  };

  await Promise.all([
    // React — the TS worker needs these to provide types for .tsx files
    tryLoad("@types/react/index.d.ts"),
    tryLoad("@types/react/global.d.ts"),
    tryLoad("@types/react/jsx-runtime.d.ts"),
    tryLoad("@types/react/jsx-dev-runtime.d.ts"),
    tryLoad("@types/react-dom/index.d.ts"),
    // Angular — loaded only if the user has @angular/core installed
    tryLoad("@angular/core/index.d.ts"),
    tryLoad("@angular/common/index.d.ts"),
  ]);

  // Use minimal csstype stub instead of the 895KB full file
  result["csstype/index.d.ts"] = CSSTYPE_STUB;

  // Minimal Vue stub so <script setup> blocks get ref/reactive/computed types
  result["vue/index.d.ts"] = VUE_STUB;

  // Minimal Svelte stub so <script> blocks get $state/$derived/$props types
  result["svelte/index.d.ts"] = SVELTE_STUB;

  return result;
};

// ── Framework reorganization ──────────────────────────────────

/**
 * Check whether reorganization is needed when adding a second framework.
 * Returns the framework that should be moved into its own subfolder,
 * or null if no reorganization is needed.
 */
export const checkNeedsReorganization = (
  config: ProjectConfig,
  newFramework: StudioFramework,
): { framework: StudioFramework; currentDirectory: string } | null => {
  const configured = getConfiguredFrameworks(config);
  // Only trigger when going from exactly 1 → 2 frameworks
  if (configured.length !== 1) return null;

  const existing = configured[0]!;
  // Don't suggest if adding the same framework
  if (existing.framework === newFramework) return null;

  // Only suggest reorganization if the existing framework is NOT already in its own subfolder.
  // If the directory basename matches the framework name (e.g., .../react), it's already isolated.
  const dirBasename = basename(
    existing.directory.replace(/\\/g, "/").replace(/\/$/, ""),
  );
  if (dirBasename === existing.framework) return null;

  return {
    framework: existing.framework,
    currentDirectory: existing.directory,
  };
};

/**
 * Move a framework from the root frontend directory into its own subfolder.
 * e.g., src/frontend/ → src/frontend/react/
 * Updates absolute.config.ts and server.ts imports.
 */
export const reorganizeFramework = async (
  framework: StudioFramework,
  projectDir: string,
  currentDirectory: string,
) => {
  const newDirectory = join(currentDirectory, framework);
  mkdirSync(newDirectory, { recursive: true });

  // Move framework-specific directories (pages, components, utils)
  // but NOT shared directories (styles) or other framework dirs
  const otherFrameworkNames = new Set(
    ALL_FRAMEWORKS.filter((f) => f !== framework),
  );
  const sharedDirs = new Set(["styles", "indexes"]);
  const skipDirs = new Set([...otherFrameworkNames, ...sharedDirs, framework]);

  const movedEntries: string[] = [];
  const entries = readdirSync(currentDirectory, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const src = join(currentDirectory, entry.name);
    const dest = join(newDirectory, entry.name);
    renameSync(src, dest);
    movedEntries.push(entry.name);
  }

  // Update absolute.config.ts
  await updateConfigDirectoryValue(framework, projectDir, newDirectory);

  // Update server.ts imports — only for paths pointing to moved items
  await updateServerImports(
    projectDir,
    currentDirectory,
    newDirectory,
    movedEntries,
  );

  return newDirectory;
};

/**
 * Move a framework from its subfolder back to the root frontend directory.
 * e.g., src/frontend/react/ → src/frontend/
 * Updates absolute.config.ts and server.ts imports.
 */
export const consolidateFramework = async (
  framework: StudioFramework,
  projectDir: string,
  currentDirectory: string,
) => {
  const parentDir = dirname(currentDirectory);

  const entries = readdirSync(currentDirectory, { withFileTypes: true });
  for (const entry of entries) {
    const src = join(currentDirectory, entry.name);
    const dest = join(parentDir, entry.name);
    // Don't overwrite existing shared directories
    if (existsSync(dest)) continue;
    renameSync(src, dest);
  }

  // Remove the now-empty framework subfolder
  try {
    rmSync(currentDirectory, { recursive: true });
  } catch {
    // may not be fully empty if shared dirs existed
  }

  // Update absolute.config.ts
  await updateConfigDirectoryValue(framework, projectDir, parentDir);

  // Update server.ts imports
  await updateServerImports(projectDir, currentDirectory, parentDir);

  return parentDir;
};

/**
 * Update a specific framework directory value in absolute.config.ts.
 */
const updateConfigDirectoryValue = async (
  framework: StudioFramework,
  projectDir: string,
  newDirectory: string,
) => {
  const meta = getFrameworkMeta(framework);
  const configPath = join(projectDir, "absolute.config.ts");
  if (!existsSync(configPath)) return;

  const relativePath = relative(projectDir, newDirectory).replace(/\\/g, "/");
  let content = await Bun.file(configPath).text();

  // Replace the existing directory value
  const pattern = new RegExp(`(${meta.configKey}\\s*:\\s*)['"][^'"]+['"]`);
  content = content.replace(pattern, `$1'${relativePath}'`);

  await Bun.write(configPath, content);
};

/**
 * Update import paths in server.ts when a framework directory moves.
 * Only replaces paths that point to items that were actually moved,
 * not paths to other framework subdirectories.
 */
const updateServerImports = async (
  projectDir: string,
  oldDirectory: string,
  newDirectory: string,
  movedEntries?: string[],
) => {
  const serverPath = findServerFile(projectDir);
  if (!serverPath) return;

  const oldRelDir = computeRelativeDir(dirname(serverPath), oldDirectory);
  const newRelDir = computeRelativeDir(dirname(serverPath), newDirectory);

  let content = await Bun.file(serverPath).text();

  if (movedEntries && movedEntries.length > 0) {
    // Only replace paths that continue with one of the moved entries
    // e.g., ../frontend/pages/... → ../frontend/react/pages/...
    // but NOT ../frontend/svelte/... (svelte wasn't moved)
    for (const entry of movedEntries) {
      content = content.replaceAll(
        `${oldRelDir}/${entry}`,
        `${newRelDir}/${entry}`,
      );
    }
  } else {
    // Consolidation: replace exact framework dir path
    // e.g., ../frontend/react/ → ../frontend/
    content = content.replaceAll(oldRelDir, newRelDir);
  }

  await Bun.write(serverPath, content);
};

// ── Page deletion ─────────────────────────────────────────────

/**
 * Delete a page file and remove its route from server.ts.
 * Returns whether this was the last page of the framework.
 */
export const deletePage = async (
  pageName: string,
  route: string,
  framework: StudioFramework,
  projectDir: string,
  frameworkDir: string,
  stylesDirectory?: string,
): Promise<{
  deletedFile: string | null;
  isLastPage: boolean;
  frameworkDir: string;
}> => {
  const meta = getFrameworkMeta(framework);
  const pagesDir = join(frameworkDir, "pages");
  const filePath = join(pagesDir, `${pageName}${meta.extension}`);

  // Remove the route from server.ts first, then check if any other
  // route still references this component before deleting the file.
  await removePageRoute(pageName, route, framework, projectDir);

  let deletedFile: string | null = null;
  if (existsSync(filePath)) {
    // Only delete the file if no other route still uses this component
    const serverPath = findServerFile(projectDir);
    let stillReferenced = false;
    if (serverPath) {
      const serverContent = await Bun.file(serverPath).text();
      // Check if the component name still appears in a handler call
      stillReferenced = serverContent.includes(pageName);
    }
    if (!stillReferenced) {
      unlinkSync(filePath);
      deletedFile = filePath;

      // Also remove the page's CSS file from the shared styles directory
      if (stylesDirectory) {
        const cssPath = join(stylesDirectory, `${toKebab(pageName)}.css`);
        if (existsSync(cssPath)) unlinkSync(cssPath);
      }

      // Remove the page's HTML template file (Angular uses external templateUrl)
      const htmlTemplatePath = join(
        frameworkDir,
        "templates",
        `${toKebab(pageName)}.html`,
      );
      if (existsSync(htmlTemplatePath)) unlinkSync(htmlTemplatePath);

      // Remove build artifacts for HTML/HTMX pages (they're copied as-is,
      // not hashed, so the build system's stale output cleanup won't catch them)
      if (framework === "html" || framework === "htmx") {
        const buildPath = join(
          projectDir,
          "build",
          framework,
          "pages",
          `${pageName}${meta.extension}`,
        );
        if (existsSync(buildPath)) unlinkSync(buildPath);
      }
    }
  }

  // Check if this was the last page
  let isLastPage = true;
  if (existsSync(pagesDir)) {
    const remaining = readdirSync(pagesDir).filter((f) => !f.startsWith("."));
    isLastPage = remaining.length === 0;
  }

  return { deletedFile, isLastPage, frameworkDir };
};

/**
 * Remove a page route + its imports from server.ts.
 * For vue pages using vueImporter, also update/remove vueImporter.ts.
 */
const removePageRoute = async (
  pageName: string,
  route: string,
  framework: StudioFramework,
  projectDir: string,
) => {
  // Update vueImporter before modifying server.ts so the dev server
  // doesn't try to rebuild with stale imports pointing to deleted files.
  if (framework === "vue") {
    await removeFromVueImporter(pageName, projectDir);
  }

  const serverPath = findServerFile(projectDir);
  if (!serverPath) return;

  let content = await Bun.file(serverPath).text();

  // Remove the .get() route block for this route by finding balanced parens.
  // Regex-only approaches break when nesting depth varies across frameworks
  // (e.g. handleHTMLPageRequest(asset(...)) has 3 closing parens).
  const getPrefix = `\n\t.get('${route}'`;
  const getPrefixAlt = `\n\t.get("${route}"`;
  let getStart = content.indexOf(getPrefix);
  if (getStart === -1) getStart = content.indexOf(getPrefixAlt);

  if (getStart !== -1) {
    // Find the opening ( of .get(
    const parenStart = content.indexOf("(", getStart + 2);
    if (parenStart !== -1) {
      // Walk forward counting balanced parens to find the matching close
      let depth = 0;
      let i = parenStart;
      for (; i < content.length; i++) {
        if (content[i] === "(") depth++;
        else if (content[i] === ")") {
          depth--;
          if (depth === 0) break;
        }
      }
      // Remove from the \n before .get to the closing )
      content = content.slice(0, getStart) + content.slice(i + 1);
    }
  }

  // Remove any imports that are now unused after the route was deleted.
  // This handles component imports (named or default) and handler imports
  // regardless of whether the pageName matches the actual import name.
  const lines = content.split("\n");
  const importLines: { index: number; names: string[] }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (!line.trimStart().startsWith("import ")) continue;

    // Extract imported names: named imports { A, B } and default imports
    const names: string[] = [];
    const namedMatch = line.match(/import\s+\{([^}]+)\}\s+from/);
    if (namedMatch) {
      for (const n of namedMatch[1]!.split(",")) {
        const trimmed = n.trim();
        if (trimmed) names.push(trimmed);
      }
    }
    const defaultMatch = line.match(/^import\s+(\w+)\s+from/);
    if (defaultMatch) {
      names.push(defaultMatch[1]!);
    }

    if (names.length > 0) {
      importLines.push({ index: i, names });
    }
  }

  // Build the non-import code to check for references
  const nonImportCode = lines
    .filter((line) => !line.trimStart().startsWith("import "))
    .join("\n");

  // Remove import lines where NONE of the imported names appear in non-import code
  const linesToRemove = new Set<number>();
  for (const { index, names } of importLines) {
    const allUnused = names.every((name) => !nonImportCode.includes(name));
    if (allUnused) {
      linesToRemove.add(index);
    }
  }

  if (linesToRemove.size > 0) {
    content = lines.filter((_, i) => !linesToRemove.has(i)).join("\n");
  }

  // Clean up empty lines left behind
  content = content.replace(/\n{3,}/g, "\n\n");

  await Bun.write(serverPath, content);
};

// ── Framework cleanup (last page deleted) ─────────────────────

/**
 * Clean up a framework after its last page is deleted:
 * - Remove the framework directory
 * - Remove the config entry from absolute.config.ts
 * - Remove framework-specific dependencies from package.json
 */
export const cleanupFramework = async (
  framework: StudioFramework,
  projectDir: string,
  frameworkDir: string,
) => {
  const meta = getFrameworkMeta(framework);

  // 1. Remove the framework directory
  if (existsSync(frameworkDir)) {
    rmSync(frameworkDir, { recursive: true });
  }

  // 2. Remove the config entry from absolute.config.ts
  const configPath = join(projectDir, "absolute.config.ts");
  if (existsSync(configPath)) {
    let configContent = await Bun.file(configPath).text();
    // Remove the line with the framework's config key
    configContent = configContent
      .split("\n")
      .filter((line) => !line.includes(`${meta.configKey}:`))
      .join("\n");
    // Clean up trailing commas before closing })
    configContent = configContent.replace(/,(\s*\}\))/, "$1");
    await Bun.write(configPath, configContent);
  }

  // 3. Clean up vueImporter
  if (framework === "vue") {
    // Vue is gone — delete vueImporter entirely
    deleteVueImporter(projectDir);
  } else if (framework === "svelte") {
    // Svelte is gone — vueImporter is no longer needed for type isolation.
    // If vue still has routes using vueImporter, convert to direct imports.
    const configPath = join(projectDir, "absolute.config.ts");
    let vueStillConfigured = false;
    if (existsSync(configPath)) {
      const configContent = await Bun.file(configPath).text();
      vueStillConfigured = configContent.includes("vueDirectory:");
    }
    if (vueStillConfigured) {
      await convertVueRoutesToDirectImports(projectDir);
    } else {
      deleteVueImporter(projectDir);
    }

    // Remove prettier-plugin-svelte config
    await removeSveltePrettierConfig(projectDir);
  }

  // 4. Remove framework-specific dependencies from package.json
  const removedDeps: string[] = [];
  if (meta.dependencies.length > 0 || meta.devDependencies.length > 0) {
    const pkgPath = join(projectDir, "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(await Bun.file(pkgPath).text()) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };

      let changed = false;
      for (const dep of meta.dependencies) {
        if (pkg.dependencies?.[dep]) {
          delete pkg.dependencies[dep];
          removedDeps.push(dep);
          changed = true;
        }
      }
      for (const dep of meta.devDependencies) {
        if (pkg.devDependencies?.[dep]) {
          delete pkg.devDependencies[dep];
          removedDeps.push(dep);
          changed = true;
        }
      }

      if (changed) {
        await Bun.write(pkgPath, JSON.stringify(pkg, null, "\t") + "\n");
        // Run bun install to clean up lockfile
        const proc = Bun.spawn(["bun", "install"], {
          cwd: projectDir,
          stdout: "pipe",
          stderr: "pipe",
        });
        await proc.exited;
      }
    }
  }

  return { removedDeps };
};

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const capitalize = (str: string) =>
  str === "html"
    ? "HTML"
    : str === "htmx"
      ? "HTMX"
      : str.charAt(0).toUpperCase() + str.slice(1);

export const resolveLocalImports = async (filePath: string, depth = 0) => {
  const result: Record<string, string> = {};

  try {
    const content = await Bun.file(filePath).text();
    const importRegex = /import\s+.*?from\s+['"](\.[^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1]!;
      const dir = dirname(filePath);
      let resolved = resolve(dir, importPath);

      if (!/\.\w+$/.test(resolved)) {
        const extensions = [".ts", ".tsx", ".js", ".jsx"];
        for (const ext of extensions) {
          const candidate = `${resolved}${ext}`;
          if (await Bun.file(candidate).exists()) {
            resolved = candidate;
            break;
          }
        }
      }

      const file = Bun.file(resolved);
      if (await file.exists()) {
        const importContent = await file.text();
        // Use the resolved path as key (with correct extension) so the
        // Monaco editor can create models at the right URI.
        result[resolved] = importContent;

        if (depth < 1) {
          const nested = await resolveLocalImports(resolved, depth + 1);
          Object.assign(result, nested);
        }
      }
    }
  } catch {
    // Return what we have so far
  }

  return result;
};

// ── Component scanning ─────────────────────────────────────────

export type ComponentTreeNode = {
  name: string;
  path: string;
  children?: ComponentTreeNode[];
};

/**
 * Scan a framework directory for component files (everything except pages/).
 * Returns a tree structure preserving directory nesting.
 */
export const scanFrameworkComponents = async (
  framework: StudioFramework,
  directory: string,
): Promise<ComponentTreeNode[]> => {
  // HTML and HTMX don't have components
  if (framework === "html" || framework === "htmx") return [];

  const meta = getFrameworkMeta(framework);
  const ext = meta.extension;

  const absDir = resolve(directory);
  if (!existsSync(absDir)) return [];

  const buildTree = (dir: string, relBase: string): ComponentTreeNode[] => {
    const nodes: ComponentTreeNode[] = [];
    let entries: { name: string; isDirectory(): boolean }[];
    try {
      entries = readdirSync(dir, { withFileTypes: true }) as unknown as {
        name: string;
        isDirectory(): boolean;
      }[];
    } catch {
      return nodes;
    }

    for (const entry of entries) {
      const name = String(entry.name);
      // Skip pages directory — those are pages, not components
      if (name === "pages") continue;
      // Skip node_modules, hidden dirs
      if (name.startsWith(".") || name === "node_modules") continue;

      const fullPath = join(dir, name);
      const relPath = relBase ? `${relBase}/${name}` : name;

      if (entry.isDirectory()) {
        const children = buildTree(fullPath, relPath);
        if (children.length > 0) {
          nodes.push({ name, path: relPath, children });
        }
      } else if (name.endsWith(ext)) {
        nodes.push({ name: name.replace(ext, ""), path: relPath });
      }
    }

    // Sort: directories first, then files, alphabetically
    nodes.sort((a, b) => {
      const aDir = !!a.children;
      const bDir = !!b.children;
      if (aDir !== bDir) return aDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return nodes;
  };

  return buildTree(absDir, "");
};
