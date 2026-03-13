import { mkdirSync, readdirSync, unlinkSync, renameSync } from "fs";
import { join } from "path";
import type {
  StudioBlockDefinition,
  StudioConfig,
  StudioPage,
} from "../types/studio";

const PAGES_DIR = ".studio/pages";
const BLOCKS_DIR = ".studio/blocks";
const MEDIA_DIR = ".studio/media";
const CONFIG_PATH = ".studio/config.json";

export const createStorage = (config?: StudioConfig) => {
  mkdirSync(PAGES_DIR, { recursive: true });
  mkdirSync(BLOCKS_DIR, { recursive: true });
  mkdirSync(MEDIA_DIR, { recursive: true });

  const toSafeFilename = (slug: string) => slug.replace(/[^a-zA-Z0-9_-]/g, "_");

  const listPages = async () => {
    const files = readdirSync(PAGES_DIR).filter((f) => f.endsWith(".json"));
    const pages: StudioPage[] = [];

    for (const file of files) {
      const content = await Bun.file(join(PAGES_DIR, file)).text();
      pages.push(JSON.parse(content) as StudioPage);
    }

    return pages;
  };

  const getPage = async (slug: string) => {
    const filename = `${toSafeFilename(slug)}.json`;
    const filePath = join(PAGES_DIR, filename);
    const content = await Bun.file(filePath).text();
    return JSON.parse(content) as StudioPage;
  };

  const savePage = async (page: StudioPage) => {
    const filename = `${toSafeFilename(page.slug)}.json`;
    const filePath = join(PAGES_DIR, filename);
    const tempPath = `${filePath}.tmp`;

    await Bun.write(tempPath, JSON.stringify(page, null, 2));
    renameSync(tempPath, filePath);
  };

  const deletePage = (slug: string) => {
    const filename = `${toSafeFilename(slug)}.json`;
    const filePath = join(PAGES_DIR, filename);
    unlinkSync(filePath);
  };

  const getBlockRegistry = async () => {
    const registry = new Map<string, StudioBlockDefinition>();

    // Load file-based blocks from .studio/blocks/
    const blockFiles = readdirSync(BLOCKS_DIR).filter((f) =>
      f.endsWith(".json"),
    );
    for (const file of blockFiles) {
      const content = await Bun.file(join(BLOCKS_DIR, file)).text();
      const block = JSON.parse(content) as StudioBlockDefinition;
      registry.set(block.name, block);
    }

    // Merge config blocks (later definitions win)
    if (config?.blocks) {
      for (const block of config.blocks) {
        registry.set(block.name, block);
      }
    }

    return Array.from(registry.values());
  };

  const listMedia = () => {
    return readdirSync(MEDIA_DIR);
  };

  const saveMedia = async (name: string, data: Buffer) => {
    const filePath = join(MEDIA_DIR, name);
    await Bun.write(filePath, data);
  };

  const getConfig = async () => {
    const file = Bun.file(CONFIG_PATH);
    if (!(await file.exists())) return null;

    const content = await file.text();
    return JSON.parse(content) as Record<string, unknown>;
  };

  const saveConfig = async (configData: Record<string, unknown>) => {
    const tempPath = `${CONFIG_PATH}.tmp`;
    await Bun.write(tempPath, JSON.stringify(configData, null, 2));
    renameSync(tempPath, CONFIG_PATH);
  };

  return {
    listPages,
    getPage,
    savePage,
    deletePage,
    getBlockRegistry,
    listMedia,
    saveMedia,
    getConfig,
    saveConfig,
  };
};
