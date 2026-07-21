/**
 * Thin pointer — actual recorder lives with playwright-core:
 *
 *   node ../gigant-media-roadmap/scripts/record-site-promo.mjs
 *
 * Outputs:
 *   ../gigant-media-site-promo.mp4
 *   ~/Downloads/GIGANT-MEDIA-site-promo.mp4
 */
import { spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const script = join(
  __dirname,
  "../../gigant-media-roadmap/scripts/record-site-promo.mjs"
);

const child = spawn(process.execPath, [script], {
  stdio: "inherit",
  cwd: join(__dirname, "../../gigant-media-roadmap"),
});

child.on("exit", (code) => process.exit(code ?? 1));
