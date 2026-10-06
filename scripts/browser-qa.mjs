import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";
const require = createRequire(
  resolve(import.meta.dirname, "../client/package.json")
);
const { chromium } = require("playwright-core");
const AxeBuilder = require("@axe-core/playwright").default;
const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "docs/renewal/previews");
mkdirSync(output, { recursive: true });
const server = spawn("python", [resolve(root, "scripts/preview.py")], {
  stdio: "ignore",
});
const base = "http://127.0.0.1:4173/yutakaenji/";
let browser;
const report = {
  date: new Date().toISOString(),
  engine: "",
  viewports: [],
  extra: {},
};
try {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.QA_BROWSER_EXECUTABLE || undefined,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  report.engine = await browser.version();
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["smartphone", 390, 844],
    ["small-phone", 320, 740],
    ["phone-landscape", 844, 390],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [],
      failures = [],
      badResponses = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("requestfailed", r => failures.push(r.url()));
    page.on("response", r => {
      if (r.status() >= 400) badResponses.push([r.status(), r.url()]);
    });
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver(list =>
        list.getEntries().forEach(e => {
          if (!e.hadRecentInput) window.__cls += e.value;
        })
      ).observe({ type: "layout-shift", buffered: true });
    });
    assert.equal(
      (await page.goto(base, { waitUntil: "networkidle" })).status(),
      200
    );
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(
      await page.locator("h1").innerText(),
      "配電盤・制御盤の設計・製作\nケーブル・ハーネス加工"
    );
    const dimensions = await page.evaluate(() => ({
      viewport: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    assert(
      dimensions.scroll <= width,
      `${name} overflows: ${dimensions.scroll}`
    );
    const brokenImages = await page
      .locator("img")
      .evaluateAll(images =>
        images.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src)
      );
    assert.deepEqual(brokenImages, []);
    for (const href of await page
      .locator('a[href^="#"]')
      .evaluateAll(a => [...new Set(a.map(x => x.getAttribute("href")))]))
      assert(await page.locator(href).count(), `Missing ${href}`);
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(":focus").innerText(), "本文へ移動");
    assert.notEqual(
      await page
        .locator(":focus")
        .evaluate(e => getComputedStyle(e).outlineStyle),
      "none"
    );
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(":focus").getAttribute("id"), "main");
    await page.evaluate(() => scrollTo(0, 0));
    if (width < 1000) {
      const button = page.locator(".menu-toggle");
      await button.click();
      assert.equal(await button.getAttribute("aria-expanded"), "true");
      await page.screenshot({ path: resolve(output, `${name}-menu.png`) });
      const openAxe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      assert.deepEqual(
        openAxe.violations.map(v => v.id),
        []
      );
      await page.keyboard.press("Tab");
      assert.equal(
        await page.locator(":focus").getAttribute("href"),
        "#business"
      );
      await page.keyboard.press("Escape");
      assert.equal(
        await page.locator(":focus").getAttribute("aria-controls"),
        "mobile-menu"
      );
      assert.equal(await page.locator("#mobile-menu").isVisible(), false);
      await page.getByRole("button", { name: "メニュー" }).click();
      await page
        .locator("#mobile-menu")
        .getByRole("link", { name: "お問い合わせ", exact: false })
        .click();
      assert.equal(await page.locator("#mobile-menu").isVisible(), false);
      assert.equal(await page.locator(":focus").getAttribute("id"), "contact");
      await page.getByRole("button", { name: "メニュー" }).click();
      await page.setViewportSize({ width: 1200, height });
      await page.locator("#mobile-menu").waitFor({ state: "hidden" });
      await page.setViewportSize({ width, height });
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: resolve(output, `${name}.png`) });
    if (name === "desktop" || name === "smartphone")
      await page.screenshot({
        path: resolve(output, `${name}-full.png`),
        fullPage: true,
      });
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    const item = {
      name,
      width,
      height,
      dimensions,
      errors,
      failures,
      badResponses,
      brokenImages,
      axeViolations: axe.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map(n => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
      cls: await page.evaluate(() => window.__cls),
    };
    report.viewports.push(item);
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    assert.deepEqual(badResponses, []);
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: false,
  });
  let page = await context.newPage();
  await page.goto(base);
  assert(await page.getByRole("heading", { level: 1 }).isVisible());
  assert(await page.locator('a[href="tel:0878746556"]').count());
  report.extra.noJavaScript = "PASS: content and phone links";
  await context.close();
  page = await browser.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base);
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior
    ),
    "auto"
  );
  report.extra.reducedMotion = "PASS";
  for (const path of ["not-a-page", "nested/unknown"]) {
    const response = await page.goto(base + path);
    assert.equal(response.status(), 404);
    assert(
      await page
        .getByRole("heading", { name: "ページが見つかりません。" })
        .isVisible()
    );
    await page.getByRole("link", { name: "トップページへ戻る" }).click();
    assert.equal(new URL(page.url()).pathname, "/yutakaenji/");
  }
  report.extra.notFound = "PASS: HTTP 404 and working return link";
  await page.goto(base + "harness-quote/");
  assert(
    await page
      .getByRole("heading", { name: "ハーネス加工のご相談" })
      .isVisible()
  );
  assert.equal(await page.locator("form").count(), 0);
  report.extra.oldQuoteURL = "PASS: telephone consultation, no fake submission";
  report.extra.reflow =
    "320 CSS px verified; no claim of separate text-only zoom or Safari testing";
  writeFileSync(
    resolve(root, "docs/renewal/browser-qa.json"),
    JSON.stringify(report, null, 2) + "\n"
  );
  assert(
    report.viewports.every(v => v.axeViolations.length === 0),
    "Accessibility violations; see browser-qa.json"
  );
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  writeFileSync(
    resolve(root, "docs/renewal/browser-qa.json"),
    JSON.stringify({ ...report, error: String(error) }, null, 2) + "\n"
  );
  throw error;
} finally {
  if (browser) await browser.close();
  server.kill();
}
