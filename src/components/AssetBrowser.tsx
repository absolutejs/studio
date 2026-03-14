import { useState, useMemo, useEffect, useRef } from "react";

type AssetBrowserProps = {
  files: string[];
  root: string | null;
  onSelect: (path: string) => void;
  onClose: () => void;
};

type TreeNode = {
  name: string;
  path: string;
  children: TreeNode[];
  isFile: boolean;
};

const buildTree = (files: string[]): TreeNode[] => {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i]!;
      const isFile = i === parts.length - 1;
      const path = parts.slice(0, i + 1).join("/");

      let existing = current.find(
        (n) => n.name === name && n.isFile === isFile,
      );
      if (!existing) {
        existing = { name, path, children: [], isFile };
        current.push(existing);
      }
      current = existing.children;
    }
  }

  return root;
};

const getFileExt = (name: string): string =>
  name.split(".").pop()?.toLowerCase() ?? "";

const TreeItem = ({
  node,
  root,
  depth,
  onSelect,
  expandedDirs,
  toggleDir,
}: {
  node: TreeNode;
  root: string | null;
  depth: number;
  onSelect: (path: string) => void;
  expandedDirs: Set<string>;
  toggleDir: (path: string) => void;
}) => {
  const isExpanded = expandedDirs.has(node.path);

  if (!node.isFile) {
    return (
      <>
        <div
          className="studio-asset-tree-item studio-asset-tree-dir"
          style={{ paddingLeft: `${depth * 12}px` }}
          onClick={() => toggleDir(node.path)}
        >
          <span
            className={`studio-category-chevron ${isExpanded ? "studio-category-chevron-open" : ""}`}
          >
            &#9654;
          </span>
          <span className="studio-asset-tree-name">{node.name}</span>
          <span className="studio-asset-tree-count">
            {node.children.length}
          </span>
        </div>
        {isExpanded &&
          node.children.map((child) => (
            <TreeItem
              key={child.path}
              node={child}
              root={root}
              depth={depth + 1}
              onSelect={onSelect}
              expandedDirs={expandedDirs}
              toggleDir={toggleDir}
            />
          ))}
      </>
    );
  }

  const assetPath = `/assets/${node.path}`;
  const ext = getFileExt(node.name);

  return (
    <div
      className="studio-asset-tree-item studio-asset-tree-file"
      style={{ paddingLeft: `${8 + depth * 12}px` }}
      onClick={() => onSelect(assetPath)}
      title={assetPath}
    >
      <span className="studio-asset-tree-ext" data-ext={ext}>
        .{ext}
      </span>
      <span className="studio-asset-tree-name">{node.name}</span>
    </div>
  );
};

export const FolderIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 4v8a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1H8L6.5 3.5A1 1 0 005.8 3H3a1 1 0 00-1 1z" />
  </svg>
);

export const AssetBrowser = ({
  files,
  root,
  onSelect,
  onClose,
}: AssetBrowserProps) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(
    () => new Set(),
  );
  const [filter, setFilter] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside (skip clicks on the toggle button itself
  // to avoid close-then-reopen race with the button's onClick)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current && !ref.current.contains(target)) {
        const btn = (target as Element).closest?.(".studio-asset-browse-btn");
        if (!btn) onClose();
      }
    };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [onClose]);

  const tree = useMemo(() => {
    if (!filter) return buildTree(files);
    const filtered = files.filter((f) =>
      f.toLowerCase().includes(filter.toLowerCase()),
    );
    return buildTree(filtered);
  }, [files, filter]);

  const toggleDir = (path: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const allDirPaths = useMemo(() => {
    const dirs = new Set<string>();
    for (const file of files) {
      const parts = file.split("/");
      for (let i = 1; i < parts.length; i++) {
        dirs.add(parts.slice(0, i).join("/"));
      }
    }
    return dirs;
  }, [files]);

  const toggleExpandAll = () => {
    if (expandedDirs.size === allDirPaths.size) {
      setExpandedDirs(new Set());
    } else {
      setExpandedDirs(new Set(allDirPaths));
    }
  };

  return (
    <div className="studio-asset-browser" ref={ref}>
      <div className="studio-asset-browser-header">
        <span className="studio-asset-browser-title">Assets</span>
        <button
          className="studio-asset-expand-btn"
          onClick={toggleExpandAll}
          title={
            expandedDirs.size === allDirPaths.size
              ? "Collapse all"
              : "Expand all"
          }
        >
          <span
            className={`studio-category-chevron ${expandedDirs.size === allDirPaths.size ? "studio-category-chevron-open" : ""}`}
          >
            &#9654;
          </span>
        </button>
      </div>
      <div className="studio-asset-browser-search">
        <input
          className="studio-inspector-value"
          type="text"
          placeholder="Filter..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="studio-asset-browser-tree">
        {tree.length === 0 ? (
          <div className="studio-asset-browser-empty">
            {filter ? "No matching assets" : "No assets found"}
          </div>
        ) : (
          tree.map((node) => (
            <TreeItem
              key={node.path}
              node={node}
              root={root}
              depth={0}
              onSelect={onSelect}
              expandedDirs={expandedDirs}
              toggleDir={toggleDir}
            />
          ))
        )}
      </div>
    </div>
  );
};
