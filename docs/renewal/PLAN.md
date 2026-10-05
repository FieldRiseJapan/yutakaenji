# Phase 1 design and implementation plan

Goal: A trustworthy, mobile-first corporate site, ready for president review, with no publishing.
Authority: President's 2026-10-05 brief; autonomous design/implementation explicitly authorized.
Baseline: 61870fde62a29ebf62359ea1d72c634a45b7876d. Branch: feature/yutaka-website-renewal-v1.

## Architecture
Keep React/Vite. Use client/ as the independent static build. Preserve legacy server and RFQ sources but exclude them from public bundle. Pre-render the single-page corporate content so core information works without JavaScript. Keep assets local, no runtime services, tracking, external fonts or paid APIs.

## Design
White/ink navy, restrained red accent, numbered engineering service blocks, legible Japanese system typography, generous whitespace. Lead with three existing business areas; then manufacturing, promise/message, history/company, documents, phone consultation. Original abstract circuit diagram is explicitly decorative, never an equipment photo. Retain existing factual copy; omit unverified opening hours; retain certification only as historic event.

## Tasks / evidence
- [x] Audit complete repository, dependencies, source facts/assets; record preserve/improve/remove decisions.
- [x] Implement Home.tsx, index.css, static App/main, local diagram/favicon/OG; preserve company data.
- [x] Fix client build/base path, pre-render HTML, 404, SEO metadata and sitemap; no deployment workflow.
- [x] Browser QA at 1440, 768, 390, 320px, menu keyboard/Escape/focus, links and resources, JS off, reduced motion, console/errors; save screenshots and results.
- [x] Scan tracked sources and built output for credentials and unwanted runtime code; review diff.
- [x] Commit/push feature branch, verify SHA parity, clean tree and unchanged main; no publishing.

## Review focus
Missing source images/PDFs must not turn into broken links or false photos. Unknown paths need a genuine 404 page. Subpath /yutakaenji/ must work. Collapsed menu must not contain focusable hidden links. Static version must not claim a quote was submitted. Company facts remain subject to owner currency/permission review.

## Decisions
- Existing README is stale: server/DB/RFQ exist. Keep historical code; static public entry imports none of them.
- Former Manus asset URL in VISUAL-EDIT-VERIFICATION.md returns HTTP404. Preserve old asset definitions; show document titles with telephone-request guidance until restored.
- Official company search result confirms main telephone; direct official HTTPS returns certificate-related gateway error. Do not infer up-to-date officer/certification facts from stale crawls.

Final handoff verification: type/build/static checks and Chromium QA repeated on 2026-10-06 JST. Branch synchronization confirmed in final chat report.
