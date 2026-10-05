import { build } from "vite";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
process.chdir(resolve(import.meta.dirname, ".."));
await build();
const temporary = resolve(".prerender");
try {
  await build({
    build: { ssr: "src/prerender.tsx", outDir: temporary, emptyOutDir: true },
  });
  const { html } = await import(
    pathToFileURL(resolve(temporary, "prerender.js")).href
  );
  const index = resolve("../dist/index.html");
  const template = await readFile(index, "utf8");
  await writeFile(
    index,
    template.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  );
  // Preserve old public entry URLs as actual static pages. No API-backed form is exposed.
  for (const path of ["harness-quote"]) {
    await mkdir(resolve("../dist", path), { recursive: true });
    const page = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>ハーネス加工のご相談｜ユタカエンジニアリング</title><link rel="icon" href="../favicon.svg"><style>body{font-family:system-ui,sans-serif;color:#142936;max-width:650px;margin:12vh auto;padding:24px;line-height:2}a{color:#142936;display:inline-block;padding:12px 0}a:focus-visible{outline:3px solid #b3352c;outline-offset:4px}h1{font-size:28px}</style></head><body><main><p>株式会社ユタカエンジニアリング</p><h1>ハーネス加工のご相談</h1><p>お見積もりや製作のご相談は、お電話で承ります。図面・用途・数量など、現在お分かりの内容をお伝えください。</p><p><a href="tel:0878746556">電話：087-874-6556</a></p><p><a href="../#contact">会社サイトへ戻る →</a></p></main></body></html>`;
    await writeFile(resolve("../dist", path, "index.html"), page);
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
