import type { Subprocess } from "bun";
import { join, resolve } from "path";

const DEFAULT_STUDIO_PORT = 3625;
const DEFAULT_DEV_PORT = 3000;

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const MAGENTA = "\x1b[35m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";

const parseArgs = () => {
  const args = process.argv.slice(2);
  let projectDir = "";
  let reactDirectory = "";
  let devEntry = "";
  let devConfig = "";
  let port = DEFAULT_STUDIO_PORT;
  let devPort = DEFAULT_DEV_PORT;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg === "--port" && args[i + 1]) {
      port = Number(args[++i]);
    } else if (arg === "--dev-port" && args[i + 1]) {
      devPort = Number(args[++i]);
    } else if (arg === "--react" && args[i + 1]) {
      reactDirectory = args[++i]!;
    } else if (arg === "--dev-entry" && args[i + 1]) {
      devEntry = args[++i]!;
    } else if (arg === "--config" && args[i + 1]) {
      devConfig = args[++i]!;
    } else if (!arg.startsWith("--") && !projectDir) {
      projectDir = arg;
    }
  }

  return {
    projectDir: projectDir || process.cwd(),
    reactDirectory,
    devEntry,
    devConfig,
    port,
    devPort,
  };
};

const VERSION = "0.0.0";

const getDurationString = (ms: number) => {
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
};

const printBanner = (studioPort: number, devPort: number, duration: number) => {
  const name = `${MAGENTA}${BOLD}ABSOLUTE STUDIO${RESET}`;
  const ver = `${DIM}v${VERSION}${RESET}`;
  const time = `${DIM}ready in${RESET} ${BOLD}${getDurationString(duration)}${RESET}`;
  console.log();
  console.log(`  ${name} ${ver}  ${time}`);
  console.log();
  console.log(
    `  ${GREEN}➜${RESET}  ${BOLD}Studio:${RESET}      http://localhost:${studioPort}`,
  );
  console.log(
    `  ${GREEN}➜${RESET}  ${BOLD}Dev server:${RESET}  http://localhost:${devPort}`,
  );
  console.log();
};

const printHint = () => {
  console.log(`${DIM}press h + enter to show commands${RESET}`);
};

const printHelp = () => {
  console.log();
  console.log(`  ${BOLD}Commands:${RESET}`);
  console.log(
    `  ${DIM}r${RESET}  restart    ${DIM}\u2014 restart the dev server${RESET}`,
  );
  console.log(
    `  ${DIM}o${RESET}  open       ${DIM}\u2014 open studio in browser${RESET}`,
  );
  console.log(
    `  ${DIM}c${RESET}  clear      ${DIM}\u2014 clear the terminal${RESET}`,
  );
  console.log(
    `  ${DIM}q${RESET}  quit       ${DIM}\u2014 shut down the studio${RESET}`,
  );
  console.log(
    `  ${DIM}h${RESET}  help       ${DIM}\u2014 show this help${RESET}`,
  );
  console.log();
};

const openBrowser = async (url: string) => {
  const isWSL = process.platform === "linux" && process.env.WSL_DISTRO_NAME;
  let cmd: string[];

  if (isWSL) {
    cmd = ["cmd.exe", "/c", "start", url];
  } else if (process.platform === "darwin") {
    cmd = ["open", url];
  } else {
    cmd = ["xdg-open", url];
  }

  try {
    const proc = Bun.spawn(cmd, { stdout: "ignore", stderr: "ignore" });
    await proc.exited;
  } catch {
    console.log(
      `  ${YELLOW}Could not open browser. Visit: ${CYAN}${url}${RESET}`,
    );
  }
};

const killPort = async (port: number) => {
  try {
    const proc = Bun.spawn(
      ["sh", "-c", `lsof -ti:${port} | xargs kill 2>/dev/null`],
      {
        stdout: "ignore",
        stderr: "ignore",
      },
    );
    await proc.exited;
  } catch {
    // port may not be in use
  }
};

const main = async () => {
  const startTime = performance.now();
  const { projectDir, reactDirectory, devEntry, devConfig, port, devPort } =
    parseArgs();

  // Kill stale processes on both ports
  await killPort(port);
  await killPort(devPort);

  // Start the user's dev server as a subprocess
  let devProc: Subprocess | null = null;

  const spawnDevServer = () => {
    const devArgs = ["bun", "run", "dev"];

    const proc = Bun.spawn(devArgs, {
      cwd: projectDir,
      env: {
        ...(process.env as Record<string, string>),
        PORT: String(devPort),
        FORCE_COLOR: "1",
      },
      stdin: "ignore",
      stdout: "pipe",
      stderr: "pipe",
    });

    const stripAnsi = (str: string) =>
      str.replace(/\x1b\[[0-9;]*[A-Za-z]/g, "").replace(/\r/g, "");

    const SUPPRESS_PATTERNS = [
      "ABSOLUTEJS",
      "Local:",
      "Network:",
      "press h",
      "$ absolute",
    ];

    const isBannerLine = (line: string) => {
      const clean = stripAnsi(line).trim();
      if (clean === "" || clean === ">") return true;
      return SUPPRESS_PATTERNS.some((p) => clean.includes(p));
    };

    // Matches the dev server's interactive prompt: \r\x1b[2K\x1b[90m> \x1b[0m
    const PROMPT_RE = /\r?\x1b\[2K\x1b\[90m> \x1b\[0m/g;

    let bannerDone = false;

    const readStream = async (
      stream: ReadableStream<Uint8Array>,
      target: NodeJS.WriteStream,
    ) => {
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          let text = decoder.decode(value, { stream: true });
          text = text.replace(PROMPT_RE, "");
          if (bannerDone) {
            if (text) target.write(text);
            continue;
          }
          const lines = text.split("\n");
          const kept: string[] = [];
          for (const line of lines) {
            if (isBannerLine(line)) continue;
            bannerDone = true;
            kept.push(line);
          }
          if (kept.length > 0) target.write(kept.join("\n"));
        }
      } catch {
        // stream closed
      }
    };

    readStream(proc.stdout as ReadableStream<Uint8Array>, process.stdout);
    readStream(proc.stderr as ReadableStream<Uint8Array>, process.stderr);

    // If the child exits on its own (e.g. from its own Ctrl+C handler), shut down the studio too
    proc.exited.then(() => {
      if (devProc === proc) shutdown();
    });

    return proc;
  };

  // Start the user's dev server
  devProc = spawnDevServer();

  // Wait for the dev server to start
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Load absolute.config.ts from the project to get all framework directories
  const devServerUrl = `http://localhost:${devPort}`;

  let projectConfig: Record<string, unknown> = {};
  try {
    const configPath = devConfig
      ? resolve(devConfig)
      : resolve(projectDir, "absolute.config.ts");
    const mod = await import(configPath);
    projectConfig = mod.default ?? mod.config ?? {};
  } catch (err) {
    console.warn(
      `${YELLOW}⚠${RESET} Could not load absolute.config.ts: ${(err as Error).message}`,
    );
  }

  // Start the studio server (reads pre-built assets from build/)
  try {
    const { startStudio } = await import("./server");
    await startStudio({
      port,
      projectDir,
      devServerUrl,
      reactDirectory:
        reactDirectory ||
        (projectConfig.reactDirectory
          ? join(projectDir, projectConfig.reactDirectory as string)
          : undefined),
      svelteDirectory: projectConfig.svelteDirectory
        ? join(projectDir, projectConfig.svelteDirectory as string)
        : undefined,
      vueDirectory: projectConfig.vueDirectory
        ? join(projectDir, projectConfig.vueDirectory as string)
        : undefined,
      htmlDirectory: projectConfig.htmlDirectory
        ? join(projectDir, projectConfig.htmlDirectory as string)
        : undefined,
      htmxDirectory: projectConfig.htmxDirectory
        ? join(projectDir, projectConfig.htmxDirectory as string)
        : undefined,
      angularDirectory: projectConfig.angularDirectory
        ? join(projectDir, projectConfig.angularDirectory as string)
        : undefined,
      stylesDirectory: projectConfig.stylesConfig
        ? join(projectDir, projectConfig.stylesConfig as string)
        : undefined,
      assetsDirectory: projectConfig.assetsDirectory
        ? join(projectDir, projectConfig.assetsDirectory as string)
        : undefined,
    });
  } catch (err) {
    console.error(`${RED}[studio] Failed to start:${RESET}`, err);
    if (devProc) devProc.kill();
    process.exit(1);
  }

  printBanner(port, devPort, performance.now() - startTime);
  printHint();

  let shuttingDown = false;

  const shutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`\n  ${DIM}Shutting down...${RESET}`);
    if (devProc) {
      devProc.kill();
      devProc = null;
    }
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("exit", () => {
    if (devProc) devProc.kill();
  });

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf-8");

    let inputBuffer = "";

    process.stdin.on("data", async (key: string) => {
      if (key === "\x03") {
        shutdown();
        return;
      }

      if (key === "\r" || key === "\n") {
        const cmd = inputBuffer.trim().toLowerCase();
        inputBuffer = "";

        switch (cmd) {
          case "r":
          case "restart": {
            console.log(`  ${YELLOW}Restarting dev server...${RESET}`);
            if (devProc) devProc.kill();
            await killPort(devPort);
            devProc = spawnDevServer();
            break;
          }
          case "o":
          case "open": {
            await openBrowser(`http://localhost:${port}`);
            break;
          }
          case "c":
          case "clear": {
            console.clear();
            printBanner(port, devPort, performance.now() - startTime);
            break;
          }
          case "q":
          case "quit": {
            shutdown();
            break;
          }
          case "h":
          case "help": {
            printHelp();
            break;
          }
          default: {
            if (cmd) {
              console.log(
                `  ${DIM}Unknown command: "${cmd}". Press h for help.${RESET}`,
              );
            }
          }
        }
      } else {
        inputBuffer += key;
      }
    });
  }
};

main().catch((err) => {
  console.error(`${RED}[studio] Fatal error:${RESET}`, err);
  process.exit(1);
});
