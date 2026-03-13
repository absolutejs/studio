import { join, dirname, resolve } from "path";
import { Glob } from "bun";
import type { StudioFramework } from "../types/studio";

type ProjectConfig = {
  reactDirectory?: string;
  svelteDirectory?: string;
  vueDirectory?: string;
  htmlDirectory?: string;
  htmxDirectory?: string;
  angularDirectory?: string;
};

type ScannedPage = {
  name: string;
  path: string;
  framework: StudioFramework;
};

const FRAMEWORK_GLOBS: {
  key: keyof ProjectConfig;
  framework: StudioFramework;
  pattern: string;
}[] = [
  {
    key: "reactDirectory",
    framework: "react",
    pattern: "pages/*.tsx",
  },
  {
    key: "svelteDirectory",
    framework: "svelte",
    pattern: "pages/*.svelte",
  },
  {
    key: "vueDirectory",
    framework: "vue",
    pattern: "pages/*.vue",
  },
  {
    key: "htmlDirectory",
    framework: "html",
    pattern: "pages/*.html",
  },
  {
    key: "htmxDirectory",
    framework: "htmx",
    pattern: "pages/*.html",
  },
  {
    key: "angularDirectory",
    framework: "angular",
    pattern: "pages/*.ts",
  },
];

export const scanProjectPages = async (config: ProjectConfig) => {
  const pages: ScannedPage[] = [];

  for (const { key, framework, pattern } of FRAMEWORK_GLOBS) {
    const directory = config[key];
    if (!directory) continue;

    const glob = new Glob(pattern);
    for await (const match of glob.scan({ cwd: directory })) {
      const name = match.replace(/^pages\//, "").replace(/\.[^.]+$/, "");
      pages.push({
        name,
        path: join(directory, match),
        framework,
      });
    }
  }

  return pages;
};

export const createPageFile = async (name: string, directory: string) => {
  const filePath = join(directory, "pages", `${name}.tsx`);

  const template = `import { Head } from '@absolutejs/absolute/react'

type ${name}Props = {
	cssPath?: string
}

export default function ${name}({ cssPath }: ${name}Props) {
	return (
		<html lang="en">
			<Head cssPath={cssPath} title="${name}" />
			<body>
				<main>
					<h1>${name}</h1>
				</main>
			</body>
		</html>
	)
}
`;

  await Bun.write(filePath, template);
  return filePath;
};

export const readPageSource = async (filePath: string) => {
  return Bun.file(filePath).text();
};

export const writePageSource = async (filePath: string, content: string) => {
  await Bun.write(filePath, content);
};

export const getTypeDefinitions = async () => {
  const result: Record<string, string> = {};

  try {
    const reactTypes = await Bun.file(
      "node_modules/@types/react/index.d.ts",
    ).text();
    result["@types/react/index.d.ts"] = reactTypes;

    const cssTypes = await Bun.file("node_modules/csstype/index.d.ts").text();
    result["csstype/index.d.ts"] = cssTypes;
  } catch {
    // Return empty on error
  }

  return result;
};

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

      // Try common extensions if the path has no extension
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
        result[importPath] = importContent;

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
