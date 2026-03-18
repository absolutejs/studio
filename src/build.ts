import { build } from "@absolutejs/absolute/build";
import { join } from "path";

await build({
  buildDirectory: "build",
  reactDirectory: "src",
  stylesConfig: "src/styles",
});

// Build preview iframe scripts as standalone browser JS files.
// These are served via <script src> tags to avoid HTML parser issues
// with minified code containing `<` comparisons in inline scripts.
const iframeScripts = [
  {
    entry: "components/iframeOverlayRuntime.ts",
    name: "overlay",
    manifestKey: "StudioOverlay",
  },
  {
    entry: "components/wsRedirectRuntime.ts",
    name: "ws-redirect",
    manifestKey: "StudioWsRedirect",
  },
];

const manifestPath = "build/manifest.json";
const manifest = JSON.parse(await Bun.file(manifestPath).text());

for (const { entry, name, manifestKey } of iframeScripts) {
  const result = await Bun.build({
    entrypoints: [join(import.meta.dir, entry)],
    target: "browser",
    minify: true,
    naming: `${name}.[hash].js`,
    outdir: "build",
  });

  if (!result.success) {
    console.error(`[studio] Failed to build ${name}:`, result.logs);
    process.exit(1);
  }

  const outputPath = "/" + result.outputs[0]!.path.split("/build/")[1];
  manifest[manifestKey] = outputPath;
}

await Bun.write(manifestPath, JSON.stringify(manifest, null, "\t"));
