import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const wranglerCli = path.join(projectRoot, "node_modules", "wrangler", "bin", "wrangler.js");
const openNextCli = path.join(projectRoot, "node_modules", "@opennextjs", "cloudflare", "dist", "cli", "index.js");
const localWranglerDir = path.join(projectRoot, ".wrangler");
const configDir = path.join(localWranglerDir, "config");

for (const directory of [configDir, path.join(localWranglerDir, "logs"), path.join(localWranglerDir, "registry")]) {
  mkdirSync(directory, { recursive: true });
}

const env = {
  ...process.env,
  XDG_CONFIG_HOME: configDir,
  WRANGLER_LOG_PATH: path.join(localWranglerDir, "logs"),
  WRANGLER_REGISTRY_PATH: path.join(localWranglerDir, "registry"),
};

function run(cli, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], {
      cwd: projectRoot,
      env,
      stdio: "inherit",
    });

    child.once("error", reject);
    child.once("exit", (code, signal) => {
      resolve(code ?? (signal ? 1 : 0));
    });
  });
}

const [action, ...args] = process.argv.slice(2);
let exitCode;

if (["deploy", "preview", "upload"].includes(action)) {
  exitCode = await run(openNextCli, ["build"]);
  if (exitCode !== 0) process.exit(exitCode);

  if (action === "deploy") {
    exitCode = await run(wranglerCli, ["deploy", ...args]);
  } else {
    exitCode = await run(openNextCli, [action, ...args]);
  }
} else {
  exitCode = await run(wranglerCli, process.argv.slice(2));
}

process.exit(exitCode);
