// One-Line Laugh-Off entry: one joke, written out verbatim.
// Reads the single joke line from entry.txt next to this file and writes
// exactly that line (no trailing newline, no extra text) to entry.txt in
// the output directory. Stdlib only, no network, no wall clock.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const line = readFileSync(join(here, "entry.txt"), "utf8").trim();

if (line.length === 0 || line.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${line.length}`);
}

const outputDir =
  process.env.MAKEFUN_OUTPUT_DIR ??
  (process.env.MAKEFUN_BOT_DIR
    ? join(process.env.MAKEFUN_BOT_DIR, "output")
    : "output");

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), line, "utf8");

// The house rules also name /output/entry.txt as the artifact location;
// if the resolved output dir is elsewhere, leave a copy there too.
if (outputDir !== "/output") {
  try {
    mkdirSync("/output", { recursive: true });
    writeFileSync("/output/entry.txt", line, "utf8");
  } catch {
    // /output may not exist or be writable in a local run; the primary
    // output dir above is the authoritative one.
  }
}
