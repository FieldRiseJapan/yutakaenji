import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
const root = resolve(import.meta.dirname, "../dist");
const html = readFileSync(join(root, "index.html"), "utf8");
assert(html.includes("株式会社ユタカエンジニアリング"));
assert(html.includes("tel:0878746556"));
assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
assert(html.includes('<h2 id="contact-title"'));
assert(!html.includes("/manus-storage/"));
assert(!html.includes("fonts.googleapis.com"));
assert(html.includes("application/ld+json"));
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
for (const [, hash] of html.matchAll(/href="#([^"]+)"/g))
  assert(ids.has(hash), `Missing anchor ${hash}`);
for (const [, href] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (href.startsWith("#") || /^(https?:|tel:)/.test(href)) continue;
  const relative = href.replace(/^\/yutakaenji\//, "");
  assert(!relative.startsWith("/"), `Wrong absolute path ${href}`);
  assert(existsSync(join(root, relative)), `Missing local asset ${href}`);
}
assert(existsSync(join(root, "404.html")));
assert(existsSync(join(root, "harness-quote/index.html")));
assert(!existsSync(join(root, "__manus__")));
function files(dir) {
  return readdirSync(dir).flatMap(n =>
    statSync(join(dir, n)).isDirectory() ? files(join(dir, n)) : [join(dir, n)]
  );
}
for (const file of files(root).filter(n => n.endsWith(".js"))) {
  const js = readFileSync(file, "utf8");
  for (const forbidden of [
    "/api/trpc",
    "BUILT_IN_FORGE_API_KEY",
    "debug-collector",
    "api.openai.com",
  ])
    assert(!js.includes(forbidden), `${forbidden} leaked into public bundle`);
}
console.log(
  "PASS: prerendered content, headings, anchors, assets, base path, 404, RFQ fallback, no legacy APIs"
);
