# ユタカエンジニアリング Web刷新 Phase 1 — 社長レビュー報告

最終検証：2026-10-06。

## ① 判定
READY FOR PRESIDENT REVIEW

会社情報の最新性・資料復旧・掲載承認を公開前確認事項として残します。公開承認済みという意味ではありません。

## ② 作業ブランチ
`feature/yutaka-website-renewal-v1`

## ③ Commit
この報告書を含むコミットが成果物です。最終SHAはチャットの完了報告とGitHubのブランチHEADを参照（ファイル内への自己参照SHAは記載しません）。

## ④ 主な変更
- 丸亀電機の参考サイトを確認し、青・白の落ち着いた企業デザインに再修正。英語装飾・抽象回路図・設備風の図形・大見出しの抽象コピーを削除。事業を冒頭に明示し、会社情報・製造・相談の導線を再構成。
- 会社基本情報・代表メッセージ・沿革を保持。未確認営業時間と公開日を非表示。
- React/Viteを維持し、静的HTMLの事前生成を追加。外部フォント・画像API・管理画面を公開表示から分離。
- 旧画像は取得不能。トップの抽象図版を削除し、現物写真の復旧を公開前確認事項として保持。写真を他社やAI素材で代用していません。資料名は保持し、電話相談へ。
- モバイルメニューのhidden/Escape/focus、旧見積もりURLの電話案内、実404ページを実装。

## ⑤ ファイル
- 変更: `client/src/pages/Home.tsx`, `index.css`, `App.tsx`, `main.tsx`, `client/index.html`, `client/vite.config.ts`, client/root `package.json`, `README.md`, `.github/workflows/verify.yml`。
- 追加: `client/src/prerender.tsx`, `client/scripts/build.mjs`, `client/package-lock.json`, `client/tsconfig.json`, `client/public/assets/og.png`, `favicon.svg`, `sitemap.xml`, `404.html`。
- 移動: `client/public/__manus__/*` → `archive/manus-runtime/`。公開配信から除外し履歴保存。
- 検証・報告: `scripts/`, `docs/renewal/`（JSON証跡・画面画像を含む）。既存 `site.ts` と旧サーバーコードは保持。

## ⑥ 外部調査
社長指定の丸亀電機（2026-10-06に実ブラウザ目視）から、濃紺基調・明快な企業案内・実際の現場写真の重要性を確認。日本語中心の見出し、簡潔な会社案内に反映。写真は未復旧のため参考サイトと同等の現場写真表現は未達。日東工業の製品カテゴリ優先の情報階層、協和電興の事業・電話・相談導線を参考に独自実装。画像・文章・CSSの複製なし。`RESEARCH.md`参照。外部サイトのスマートフォン実画面まで検証したとは主張しません。

## ⑦ QA結果

| 項目 | 結果 |
| --- | --- |
| Desktop | PASS / Chromium 153, 1440×1000 |
| Tablet | PASS / 768×1024 |
| Smartphone | PASS / 390×844, 320×740, 横向き844×390 |
| Navigation | PASS / メニュー、Escape、フォーカス復帰、選択後閉じる、幅変更、skip link |
| Links | 全内部アンカー・ローカル資産存在確認PASS、tel値一致。外部Google Maps HTTP200、noopener noreferrer付与。実発信・問い合わせ送信なし |
| Console | 5サイズでエラー0、pageerror0 |
| 404 | 通常ページ資産404なし。不明URLはHTTP404、独自画面とトップ復帰PASS |
| Responsive | 5サイズで横スクロールなし。スクリーンショット目視確認 |
| その他 | JS無効でも本文/電話リンク表示、reduced motion PASS、旧見積もりURL案内PASS |

実スマートフォン端末・Safari・Firefox・支援技術による総合検証ではありません。Chromiumのviewport検証です。`browser-qa.json`参照。

## ⑧ SEO
title/description/canonical、OGP（ローカルPNG）、locale、構造化データ（社名・住所・電話のみ）、意味的見出し、静的HTML、favicon、sitemapを整備。予定URLは `https://fieldrisejapan.github.io/yutakaenji/`。公開はしていません。

robots.txtも同梱。ただしProject Pages配下のrobots.txtはホスト直下のクロール制御を代替しません。ホスト設定未変更。公開後のsitemap登録・実インデックス確認は未実施。

## ⑨ Accessibility
axe WCAG 2 A/AA・2.1 AAタグ検査で5サイズの指摘0。モバイルメニュー開状態も指摘0。見出し/dl/nav/button、装飾alt空、コントラスト、focus表示、skip link、reduced motionを対応。自動検査の0件はWCAG完全適合の証明ではありません。

## ⑩ Performance
外部フォント/サービス/APIをリクエストしない。ヒーローSVG約1.7KB、CSS約16.8KB（gzip約4.3KB）、JS約238KB（gzip約75KB）、事前生成HTML約15.5KB。width/height明示、ローカルQA観測CLS 0。画像は小さなSVG中心で、初画面に不要な大型写真なし。Lighthouse点数・本番回線のCore Web Vitalsは未測定。

## ⑪ Security
Secretパターン検査で該当0（秘密鍵/GitHub/AWS/OpenAI/資格情報入りURL）。client依存関係のnpm auditは脆弱性0。公開bundleに旧API・認証・debug collector・Secret環境変数なし。全履歴や未使用legacy依存の安全性まで保証しません。フォーム未公開・外部送信なし。

## ⑫ GitHub Pages readiness
READY（静的成果物の技術互換性）。`dist/`を`/yutakaenji/`で配信するローカル検証に合格。サーバー不要。既存Pages設定変更・本番での検証は行っていません。公開可否は⑬の社長確認後に判断してください。

## ⑬ 未完・要確認事項
1. 代表者・資本金・設立・沿革・KES取得の記載の最新性と掲載承認。KESは過去の取得事実としてのみ保持。
2. 正式写真/人物写真/ロゴ、会社パンフレット・ハーネスPR・ハザードマップの原本と掲載許諾。現状の抽象図版・電話による資料問い合わせ方式でよいか。
3. 電話窓口の運用、営業時間（現状は非掲載）、代表メッセージの掲載承認。
4. 正式公開URL/既存公式サイトとの使い分け。DNSやドメイン設定は未変更。

## ⑭ 公開状態
NOT PUBLISHED

この作業では main を変更せず、merge/Pages有効化/DNS変更/本番deploy/有料契約を実施していません。CIは検証のみ。

## ⑮ 次の推奨アクション
1. PC/スマホのプレビューを確認。
2. 会社情報と代表メッセージを承認または修正指示。
3. 正式写真・PDFの復旧、または現状の図版・電話案内を承認。
4. 公開先を決定。
5. 上記確定後、別途公開承認。
