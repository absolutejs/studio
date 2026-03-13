import { build } from "@absolutejs/absolute/build";

await build({
  buildDirectory: "build",
  reactDirectory: "src",
  stylesConfig: "src/styles",
});
