import { Elysia } from "elysia";
import { join, basename } from "path";
import { asset, handleReactPageRequest, prepare } from "@absolutejs/absolute";
import { StudioEditor } from "./pages/StudioEditor";
import {
  scanProjectPages,
  createPageFile,
  addPageRoute,
  addFramework,
  getConfiguredFrameworks,
  checkNeedsReorganization,
  reorganizeFramework,
  consolidateFramework,
  deletePage,
  cleanupFramework,
  readPageSource,
  writePageSource,
  getTypeDefinitions,
  resolveLocalImports,
} from "./project";
import type { StudioFramework } from "../types/studio";
import { openInEditor } from "./openEditor";
import { iframeOverlayScript } from "./components/iframeOverlay";
import type { StudioScriptInfo, StudioScriptRunResult } from "../types/studio";

type StudioConfig = {
  port?: number;
  projectDir?: string;
  devServerUrl?: string;
  templateDir?: string;
  reactDirectory?: string;
  svelteDirectory?: string;
  vueDirectory?: string;
  htmlDirectory?: string;
  htmxDirectory?: string;
  angularDirectory?: string;
  stylesDirectory?: string;
};

const categorizeScript = (name: string): StudioScriptInfo["category"] => {
  if (name.includes("dev") || name.includes("watch") || name.includes("start"))
    return "dev";
  if (name.includes("build") || name.includes("compile")) return "build";
  if (name.includes("test") || name.includes("spec")) return "test";
  if (
    name.includes("lint") ||
    name.includes("format") ||
    name.includes("prettier") ||
    name.includes("eslint") ||
    name.includes("typecheck")
  )
    return "lint";
  return "other";
};

/**
 * Snapshot the dev server's current rebuild counter. Used together with
 * waitForDevServer to detect when a NEW rebuild has completed, avoiding
 * false matches on stale manifest state.
 */
const getDevServerRebuildCount = async (
  devServerUrl: string,
): Promise<number> => {
  try {
    const res = await fetch(devServerUrl + "/hmr-status");
    if (res.ok) {
      const status = (await res.json()) as { rebuildCount: number };
      return status.rebuildCount;
    }
  } catch {
    // Dev server not ready
  }
  return -1;
};

/**
 * Wait for the dev server's HMR rebuild to finish by checking its
 * /hmr-status endpoint.
 *
 * - "present": waits for manifestKey to appear AND rebuildCount to
 *   exceed `afterRebuild` (so stale keys from deleted pages don't
 *   cause a false match).
 * - "rebuild-done": waits for isRebuilding to be false.
 */
const waitForDevServer = async (
  devServerUrl: string,
  manifestKey: string,
  expect: "present" | "rebuild-done" | "rebuild-complete",
  timeoutMs = 6000,
  afterRebuild = -1,
) => {
  const url = devServerUrl + "/hmr-status";
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const status = (await res.json()) as {
          manifestKeys: string[];
          isRebuilding: boolean;
          rebuildCount: number;
        };
        if (status.isRebuilding) {
          await Bun.sleep(50);
          continue;
        }
        if (expect === "rebuild-done") return;
        // "rebuild-complete": wait for rebuildCount to exceed afterRebuild
        // (ensures a rebuild actually started and finished, not just idle)
        if (expect === "rebuild-complete" && status.rebuildCount > afterRebuild)
          return;
        // "present": return once the key appears AND a new rebuild has
        // completed. The rebuildCount check is essential — manifest keys
        // from deleted pages persist (Object.assign only merges), so a
        // re-created page's key can match stale data before the rebuild
        // actually processes the new file.
        if (
          expect === "present" &&
          status.manifestKeys.includes(manifestKey) &&
          status.rebuildCount > afterRebuild
        )
          return;
      }
    } catch {
      // Dev server not ready yet
    }
    await Bun.sleep(100);
  }
};

export const startStudio = async (config: StudioConfig = {}) => {
  const port = config.port ?? 3625;
  const projectDir = config.projectDir ?? process.cwd();
  const devServerUrl = config.devServerUrl ?? "http://localhost:3000";

  const scanConfig = {
    reactDirectory: config.reactDirectory,
    svelteDirectory: config.svelteDirectory,
    vueDirectory: config.vueDirectory,
    htmlDirectory: config.htmlDirectory,
    htmxDirectory: config.htmxDirectory,
    angularDirectory: config.angularDirectory,
  };

  const { absolutejs, manifest } = await prepare();

  const app = new Elysia()
    .use(absolutejs)

    // Studio UI — served as an absolutejs React page
    .get("/", () => {
      const allFrameworks: StudioFramework[] = [
        "react",
        "svelte",
        "vue",
        "html",
        "htmx",
        "angular",
      ];
      const configured = getConfiguredFrameworks(scanConfig);
      const configuredNames = new Set(configured.map((c) => c.framework));

      return handleReactPageRequest(
        StudioEditor,
        asset(manifest, "StudioEditorIndex"),
        {
          devServerUrl,
          cssPath: asset(manifest, "StudioCSS"),
          initialFrameworks: {
            configured: configured.map((c) => ({
              framework: c.framework,
              directory: c.directory,
            })),
            available: allFrameworks.filter((f) => !configuredNames.has(f)),
          },
        },
      );
    })

    // Preview proxy — fetches dev server HTML with overlay script injected.
    // The iframe loads this so it's same-origin with the studio.
    .get("/preview", async ({ query }) => {
      const previewPath = (query as Record<string, string>).path || "/";
      const targetUrl = devServerUrl + previewPath;

      let html = "";
      try {
        const res = await fetch(targetUrl);
        html = await res.text();
        if (!res.ok) {
          return new Response(
            `<html><body style="background:#1e1e2e;color:#cdd6f4;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;margin:0"><p>Dev server returned ${res.status} for ${previewPath}</p></body></html>`,
            { headers: { "Content-Type": "text/html" } },
          );
        }
      } catch {
        return new Response(
          `<html><body style="background:#1e1e2e;color:#cdd6f4;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;margin:0"><p>Dev server unavailable at ${devServerUrl}</p></body></html>`,
          { headers: { "Content-Type": "text/html" } },
        );
      }

      // Redirect WebSocket connections (HMR) to the dev server.
      // IMPORTANT: This MUST be injected before any other scripts
      // (especially the HMR client) so window.WebSocket is replaced
      // before the HMR client tries to connect.
      const devHost = new URL(devServerUrl).host;
      const wsRedirect = `<script>(function(){var d='${devHost}',h=location.host,O=WebSocket;window.WebSocket=function(u,p){if(typeof u==='string')u=u.replace(h,d);return p!==void 0?new O(u,p):new O(u)};window.WebSocket.prototype=O.prototype;window.WebSocket.CONNECTING=0;window.WebSocket.OPEN=1;window.WebSocket.CLOSING=2;window.WebSocket.CLOSED=3})()</script>`;

      const overlayTag = `<script>${iframeOverlayScript}<\/script>`;

      let modified = html;
      // Inject wsRedirect at the start of <head> so it runs before the HMR client
      if (modified.includes("<head>")) {
        modified = modified.replace("<head>", `<head>\n${wsRedirect}`);
      } else if (modified.includes("<head ")) {
        modified = modified.replace(/<head([^>]*)>/, `<head$1>\n${wsRedirect}`);
      } else {
        // Fallback: prepend to the entire HTML
        modified = wsRedirect + modified;
      }
      // Inject overlay script at the end of body (order doesn't matter for this one)
      if (modified.includes("</body>")) {
        modified = modified.replace("</body>", `${overlayTag}\n</body>`);
      } else {
        modified += overlayTag;
      }

      return new Response(modified, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    })

    // Page API
    .get("/api/pages", async () => {
      return await scanProjectPages(projectDir, scanConfig);
    })

    .post("/api/pages", async ({ body }) => {
      const { name, route, framework } = body as {
        name: string;
        route: string;
        framework: StudioFramework;
      };

      // Wait for any in-flight build (from a previous page creation) to
      // settle before writing new files. This prevents our writes from
      // overlapping with a build whose fast-path cleanup (rm indexes/,
      // rm server/) would race with the new build.
      await waitForDevServer(devServerUrl, "", "rebuild-done", 3000);

      // Snapshot rebuild count before making changes so we can wait for
      // a NEW rebuild, not be fooled by stale manifest keys.
      const rebuildBefore = await getDevServerRebuildCount(devServerUrl);

      // Check if adding this framework needs reorganization (1 → 2 frameworks)
      const reorgInfo = checkNeedsReorganization(scanConfig, framework);

      // Scaffold framework if not yet configured
      let configured = getConfiguredFrameworks(scanConfig);
      let entry = configured.find((c) => c.framework === framework);

      if (!entry) {
        const result = await addFramework(
          framework,
          projectDir,
          config.templateDir,
          scanConfig,
        );
        const configKey = `${framework}Directory` as keyof typeof scanConfig;
        (scanConfig as Record<string, string | undefined>)[configKey] =
          result.directory;
        entry = { framework, directory: result.directory };
      }

      // Determine vueImporter context
      const hasSvelte = !!scanConfig.svelteDirectory;
      const hasVue = !!scanConfig.vueDirectory;
      const ctx = { needsVueImporter: hasSvelte && hasVue };

      // Create the page file and CSS BEFORE writing the route —
      // ensures the files exist when the dev server rebuilds.
      const filePath = await createPageFile(
        name,
        entry.directory,
        framework,
        config.stylesDirectory,
      );

      // Add the route to server.ts — triggers a --hot rebuild
      await addPageRoute(
        name,
        route,
        framework,
        projectDir,
        entry.directory,
        ctx,
      );

      const manifestKey =
        framework === "html" || framework === "htmx" ? name : `${name}Index`;

      await waitForDevServer(
        devServerUrl,
        manifestKey,
        "present",
        6000,
        rebuildBefore,
      );

      return {
        file: filePath,
        route,
        needsReorganization: reorgInfo
          ? {
              framework: reorgInfo.framework,
              currentDirectory: reorgInfo.currentDirectory,
            }
          : null,
      };
    })

    .post("/api/remove-page", async ({ body }) => {
      const { name, route, framework } = body as {
        name: string;
        route: string;
        framework: StudioFramework;
      };

      const configured = getConfiguredFrameworks(scanConfig);
      const entry = configured.find((c) => c.framework === framework);
      if (!entry) {
        return new Response(
          JSON.stringify({
            error: `Framework "${framework}" is not configured`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const result = await deletePage(
        name,
        route,
        framework,
        projectDir,
        entry.directory,
        config.stylesDirectory,
      );

      // If this was the last page, check if we should offer consolidation
      let canConsolidate: {
        framework: StudioFramework;
        directory: string;
      } | null = null;
      if (result.isLastPage) {
        // Remove the framework from scanConfig since it has no pages
        const configKey = `${framework}Directory` as keyof typeof scanConfig;
        // Don't remove from config yet — let the user decide

        // Check if a remaining framework is in a subfolder and could be consolidated
        const remaining = configured.filter((c) => c.framework !== framework);
        if (remaining.length === 1) {
          const r = remaining[0]!;
          // It's in a subfolder if the directory basename matches the framework name
          // e.g., .../frontend/react → basename "react" === framework "react" → can consolidate
          const dirBasename = basename(
            r.directory.replace(/\\/g, "/").replace(/\/$/, ""),
          );
          if (dirBasename === r.framework) {
            canConsolidate = { framework: r.framework, directory: r.directory };
          }
        }
      }

      // Wait for the HMR rebuild to finish processing the server.ts change.
      // The full rebuild in rebuildManifest now purges stale manifest keys
      // and cleans up orphaned build artifacts on disk.
      await waitForDevServer(devServerUrl, "", "rebuild-done");

      return {
        ...result,
        canConsolidate,
      };
    })

    // Frameworks API
    .get("/api/frameworks", () => {
      const all: StudioFramework[] = [
        "react",
        "svelte",
        "vue",
        "html",
        "htmx",
        "angular",
      ];
      const configured = getConfiguredFrameworks(scanConfig);
      const configuredNames = new Set(configured.map((c) => c.framework));

      return {
        configured: configured.map((c) => ({
          framework: c.framework,
          directory: c.directory,
        })),
        available: all.filter((f) => !configuredNames.has(f)),
      };
    })

    .post("/api/frameworks", async ({ body }) => {
      const { framework } = body as { framework: StudioFramework };

      // Check it's not already configured
      const configured = getConfiguredFrameworks(scanConfig);
      if (configured.some((c) => c.framework === framework)) {
        return new Response(
          JSON.stringify({
            error: `Framework "${framework}" is already configured`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const result = await addFramework(
        framework,
        projectDir,
        config.templateDir,
        scanConfig,
      );

      // Update the live scanConfig so pages show up immediately
      const configKey = `${framework}Directory` as keyof typeof scanConfig;
      (scanConfig as Record<string, string | undefined>)[configKey] =
        result.directory;

      return { framework, directory: result.directory };
    })

    // Framework reorganization
    .post("/api/reorganize", async ({ body }) => {
      const { framework } = body as { framework: StudioFramework };

      const configured = getConfiguredFrameworks(scanConfig);
      const entry = configured.find((c) => c.framework === framework);
      if (!entry) {
        return new Response(
          JSON.stringify({
            error: `Framework "${framework}" is not configured`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const newDirectory = await reorganizeFramework(
        framework,
        projectDir,
        entry.directory,
      );

      // Update live scanConfig
      const configKey = `${framework}Directory` as keyof typeof scanConfig;
      (scanConfig as Record<string, string | undefined>)[configKey] =
        newDirectory;

      return { framework, directory: newDirectory };
    })

    .post("/api/consolidate", async ({ body }) => {
      const { framework } = body as { framework: StudioFramework };

      const configured = getConfiguredFrameworks(scanConfig);
      const entry = configured.find((c) => c.framework === framework);
      if (!entry) {
        return new Response(
          JSON.stringify({
            error: `Framework "${framework}" is not configured`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const newDirectory = await consolidateFramework(
        framework,
        projectDir,
        entry.directory,
      );

      // Update live scanConfig
      const configKey = `${framework}Directory` as keyof typeof scanConfig;
      (scanConfig as Record<string, string | undefined>)[configKey] =
        newDirectory;

      return { framework, directory: newDirectory };
    })

    .post("/api/cleanup-framework", async ({ body }) => {
      const { framework } = body as { framework: StudioFramework };

      const configured = getConfiguredFrameworks(scanConfig);
      const entry = configured.find((c) => c.framework === framework);
      if (!entry) {
        return new Response(
          JSON.stringify({
            error: `Framework "${framework}" is not configured`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const result = await cleanupFramework(
        framework,
        projectDir,
        entry.directory,
      );

      // Remove from live scanConfig
      const configKey = `${framework}Directory` as keyof typeof scanConfig;
      (scanConfig as Record<string, string | undefined>)[configKey] = undefined;

      return { framework, ...result };
    })

    // Source editing
    .get("/api/source", async ({ query }) => {
      const file = query.file as string;
      const content = await readPageSource(file);
      return { content };
    })

    .put("/api/source", async ({ body }) => {
      const { file, content } = body as {
        file: string;
        content: string;
      };
      await writePageSource(file, content);
      return { ok: true };
    })

    // Monaco editor support
    .get("/api/types", async () => {
      return await getTypeDefinitions();
    })

    .get("/api/deps", async ({ query }) => {
      const file = query.file as string;
      return await resolveLocalImports(file);
    })

    // Editor integration
    .get("/api/open-editor", async ({ query }) => {
      const file = query.file as string;
      const line = query.line ? Number(query.line) : undefined;
      await openInEditor(file, line);
      return { ok: true };
    })

    // Project info
    .get("/api/project", () => {
      return { devServerUrl, projectDir };
    })

    // Scripts
    .get("/api/scripts", async () => {
      try {
        const pkgPath = join(projectDir, "package.json");
        const pkgContent = await Bun.file(pkgPath).text();
        const pkg = JSON.parse(pkgContent) as {
          scripts?: Record<string, string>;
        };
        const scripts = pkg.scripts ?? {};

        const result: StudioScriptInfo[] = Object.entries(scripts)
          .filter(
            ([name]) => !name.startsWith("pre") && !name.startsWith("post"),
          )
          .map(([name, command]) => ({
            name,
            command,
            category: categorizeScript(name),
          }))
          .sort((a, b) => {
            const categoryCompare = a.category.localeCompare(b.category);
            if (categoryCompare !== 0) return categoryCompare;
            return a.name.localeCompare(b.name);
          });

        return result;
      } catch {
        return [];
      }
    })

    .post("/api/scripts/run", async ({ body }) => {
      const { name } = body as { name: string };
      const proc = Bun.spawn(["bun", "run", name], {
        cwd: projectDir,
        stdout: "pipe",
        stderr: "pipe",
      });

      const [stdout, stderr, exitCode] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
        proc.exited,
      ]);

      const result: StudioScriptRunResult = { exitCode, stdout, stderr };
      return result;
    })

    // Catch-all: proxy unmatched requests to the dev server.
    // This handles JS dynamic imports, vendor files, and any other
    // assets the preview iframe's app needs (e.g. /react/vendor/react.js).
    // Studio's own static files (from build/) are served by the absolutejs
    // plugin above, so they take priority over this catch-all.
    .all("/*", async ({ request }) => {
      const url = new URL(request.url);
      const targetUrl = devServerUrl + url.pathname + url.search;

      try {
        const res = await fetch(targetUrl, {
          method: request.method,
          headers: request.headers,
          body:
            request.method !== "GET" && request.method !== "HEAD"
              ? request.body
              : undefined,
        });

        const headers = new Headers(res.headers);
        headers.delete("content-encoding");

        return new Response(res.body, {
          status: res.status,
          headers,
        });
      } catch {
        return new Response("Not found", { status: 404 });
      }
    });

  app.listen(port);

  return app;
};

export type StudioApp = Awaited<ReturnType<typeof startStudio>>;
