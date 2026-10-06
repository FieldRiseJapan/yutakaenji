# Independent code review

2026-10-05 / reviewer: separate Codex Astra agent, read-only review of working tree against 61870fd.

No critical or important bugs found. Static verifier was independently run against dist and passed. Reviewer checked unchanged factual data, public bundle boundary, missing-asset removal, quote fallback, base path, 404 and mobile-menu hidden/focus behavior. Reviewer did not rerun browser QA; author executed and inspected browser evidence.

Minor findings and disposition:
1. Root font-size change is not a valid test of browser zoom when CSS uses pixel sizes. Removed that misleading check/report. Report only actual viewport reflow testing at 320px; no claim of text-only zoom or Safari QA.
2. robots.txt under project Pages is not the host-root robots.txt read by crawlers. Documentation now distinguishes packaging from effective crawler policy. Host-root settings are outside scope; sitemap submission is a publication follow-up.
3. Plan checkboxes should reflect completed evidence. Updated at final handoff.

Visual follow-up: balanced Japanese section headings to avoid an isolated trailing character; reran type/build/static and browser QA after the CSS change. Japanese font was installed only in the QA environment, never downloaded by the site itself.

## 丸亀電機参考の再修正レビュー
独立レビューで横向きスマートフォンのメニュー高さ制限漏れを発見。100dvhに合わせた最大高さとスクロールを復旧し、844×390のQAを追加。Headingの不要な英語・番号propsも削除。会社データと電話導線の保持を確認。
