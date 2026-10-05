# 株式会社ユタカエンジニアリング — 企業サイト

Phase 1 の改良版です。React / Vite を維持し、GitHub Pages 向けに静的 HTML を事前生成します。**本番公開・main への merge は行っていません。**

## 確認とビルド

Node.js 22 以上、npm を使用します。実行起点はリポジトリ直下です。

```sh
npm --prefix client ci --ignore-scripts
npm run verify
python scripts/preview.py
```

ローカル確認 URL: `http://127.0.0.1:4173/yutakaenji/`

`npm run verify` は型チェック・静的ビルド・リンクと資産の検査を実行します。出力先は **dist/**。開発中は `npm run dev` も利用できます。公開相当の確認には事前生成済みの dist と上記 Python サーバーを使用してください。

## 公開前に読むもの

- [監査・設計判断](docs/renewal/AUDIT.md)
- [参考サイト調査](docs/renewal/RESEARCH.md)
- [最終レビュー報告](docs/renewal/REPORT.md)
- [実ブラウザ検証結果](docs/renewal/browser-qa.json)
- [画面プレビュー](docs/renewal/previews/)

## 更新箇所

| 内容 | ファイル |
| --- | --- |
| 会社情報・事業・代表メッセージ・沿革 | `client/src/content/site.ts` |
| 画面構成・導線 | `client/src/pages/Home.tsx` |
| 色・文字・レスポンシブ | `client/src/index.css` |
| SEO / OGP / 構造化データ | `client/index.html` |
| 図版・favicon / sitemap / 404 | `client/public/` |
| 静的生成・旧見積もり URL 案内 | `client/scripts/build.mjs` |
| ベースパス `/yutakaenji/` | `client/vite.config.ts` |

電話・住所を変更するときは構造化データと旧見積もり案内も照合してください。公開予定 URL は `https://fieldrisejapan.github.io/yutakaenji/` として metadata / sitemap に設定しています。これは公開済み URL の案内ではありません。独自ドメインへ移す場合は公開承認後に canonical / OGP / sitemap / base / 404 を一緒に更新します。

## 既存機能・資産の扱い

旧版にはサーバー、データベース、見積もり送信、管理画面、Manus 専用画像プロキシが存在します。これらは GitHub Pages で稼働しません。元ソースは保存していますが、改良版の公開エントリーからは一切読み込みません。旧バックエンドの監査・再稼働は今回の範囲外です。

`dev:legacy` / `build:legacy` / `start:legacy` は旧環境を識別するために残したコマンドです。今回の確認には使いません。ルートの pnpm lockfile は旧機能用、`client/package-lock.json` が改良版の再現可能な依存関係です。

旧画像・PDF はリポジトリに存在せず、旧保存先も取得できませんでした。旧 URL は `site.ts` / 既存台帳に保持しています。写真を捏造せず、装飾図版を同梱し、資料名と説明を残して電話での問い合わせをご案内しています。資料の提供可否と正式写真の掲載許諾は社長確認が必要です。

## ブラウザ QA

`@axe-core/playwright` とその依存 `playwright-core` を開発用途で使用しています。ローカル Chromium を準備して実行します。日本語フォントがある環境を使用してください。

```sh
QA_BROWSER_EXECUTABLE=/path/to/chromium node scripts/browser-qa.mjs
```

テストは Python プレビューを自分で起動・終了し、1440 / 768 / 390 / 320px で表示・操作・axe 検査とスクリーンショットを記録します。`scripts/preview.py` を別途起動したまま実行するとポートが重複するため、先に止めてください。

CI は静的検証のみで、デプロイ権限や公開ステップを持ちません。

注意：プロジェクト Pages の `/yutakaenji/robots.txt` は、ホスト直下の `/robots.txt` の代わりにはなりません。今回ホスト直下の設定は変更していません。公開後の sitemap 登録とクロール確認は別途必要です。
