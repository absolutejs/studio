const EDITORS = [
  { command: "code", supportsGoto: true },
  { command: "cursor", supportsGoto: true },
  { command: "subl", supportsGoto: false },
  { command: "vim", supportsGoto: false },
] as const;

const editorExists = async (command: string) => {
  try {
    const proc = Bun.spawn(["which", command], {
      stdout: "ignore",
      stderr: "ignore",
    });
    const exitCode = await proc.exited;
    return exitCode === 0;
  } catch {
    return false;
  }
};

export const openInEditor = async (filePath: string, line?: number) => {
  for (const editor of EDITORS) {
    if (await editorExists(editor.command)) {
      const args =
        editor.supportsGoto && line
          ? [editor.command, "--goto", `${filePath}:${line}`]
          : [editor.command, filePath];

      Bun.spawn(args, {
        stdout: "ignore",
        stderr: "ignore",
      });
      return;
    }
  }

  // Fall back to $EDITOR environment variable
  const envEditor = process.env.EDITOR;
  if (envEditor) {
    Bun.spawn([envEditor, filePath], {
      stdout: "ignore",
      stderr: "ignore",
    });
  }
};
