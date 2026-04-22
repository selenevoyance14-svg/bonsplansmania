import type { NextConfig } from "next";
import { readdirSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";

// Register a cleanup that runs at the very end of the Next.js build process.
// This removes the per-route RSC payload .txt files that Next.js 16 static
// export generates — they are not essential (they speed up client nav but
// Next.js falls back gracefully without them) and they balloon file count
// well beyond Cloudflare Pages' 20 000 files/deployment limit.
//
// We register on both `exit` and `beforeExit` so the cleanup runs regardless
// of how the build is invoked (npm run build, next build, or a wrapper).
const OUT_DIR = "out";
const ROOT_KEEP = [/^__next\._/];

function cleanupRscTxtSync() {
  try {
    statSync(OUT_DIR);
  } catch {
    return; // no out/ yet
  }
  let deleted = 0;
  const walk = (dir: string, depth: number): void => {
    let names: string[];
    try {
      names = readdirSync(dir);
    } catch {
      return;
    }
    for (const name of names) {
      const full = join(dir, name);
      let st;
      try {
        st = statSync(full);
      } catch {
        continue;
      }
      if (st.isDirectory()) {
        walk(full, depth + 1);
      } else if (st.isFile() && name.endsWith(".txt")) {
        const keepAtRoot = depth === 0 && ROOT_KEEP.some((p) => p.test(name));
        if (keepAtRoot) continue;
        try {
          unlinkSync(full);
          deleted++;
        } catch {
          // ignore
        }
      }
    }
  };
  walk(OUT_DIR, 0);
  if (deleted > 0) {
    console.log(`[next-config] Cleaned ${deleted} RSC payload .txt files from ${OUT_DIR}/`);
  }
}

// Only register during production build (avoid running during dev)
if (process.env.NODE_ENV === "production" || process.argv.some((a) => a.includes("build"))) {
  let ran = false;
  const runOnce = () => {
    if (ran) return;
    ran = true;
    cleanupRscTxtSync();
  };
  process.on("exit", runOnce);
  process.on("beforeExit", runOnce);
}

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  staticPageGenerationTimeout: 600,
};

export default nextConfig;
