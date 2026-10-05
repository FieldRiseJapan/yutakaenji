# Phase A audit — 2026-10-05

Baseline main: `61870fde62a29ebf62359ea1d72c634a45b7876d`。169 tracked files。AGENTS.md なし。

## 構成と問題

- `client/`: React/TypeScript、CSS、企業トップ、RFQ、管理、プライバシー等。独立 Vite 設定あり。
- `server/`, `drizzle/`, `shared/`: Express/tRPC/MySQL、見積もり、添付、通知、認証等。旧 README の「バックエンドなし」は実コードと不一致。
- `client/public/`: robots、Manus debug collector、version、gitkeep のみ。実画像・PDF・フォントは同梱されていない。
- 会社コンテンツは `site.ts`。トップに代表者・沿革・所在地・電話・事業の基本情報あり。
- 画像8種、資料PDF3種、資料サムネイルは `/manus-storage/`。根拠台帳はあるがバイナリが欠落。旧プレビュー `https://yutakaengg-2eypajdq.manus.space/manus-storage/asset-003_e93d44d7.jpg` は HTTP404。Manus 保存先を推測したり認証を迂回したりしない。
- ルート Vite は Manus runtime plugin、client Vite は API Key が必要な画像プロキシを使用。
- 旧トップ CTA は `/harness-quote`。API-backed RFQ は Pages では送信できない。旧ルーターは不明パスでも Home を返す。
- 旧 metadata: title/description/OGP 基本項目あり。canonical/og:url/og:image/構造化データ/sitemap なし。favicon もストレージ依存。
- 外部 Google Fonts に依存。manifest なし。PWA の要求がなく追加不要。
- 旧メニューは CSS ベースの隠蔽、Escape とフォーカス管理がない。見出しラベルが見出しそのものでなくコンテンツ領域を指す箇所あり。dt/dd に dl がない。
- 画像は width/height なし。未確認営業時間「平日8–17時」を掲載。セクション番号に欠番。
- 既存 GitHub workflow は検証のみ、Pages デプロイなし。pnpm setup 前に cache を要求し、旧ルート build はバックエンドも生成する。

## 残す / 改善 / 削除候補の処置

| 対象 | 判断・実施 |
| --- | --- |
| 正式社名・事業・電話・所在地・代表文・会社概要・沿革 | 保持。最新性の確認は下記に区別 |
| つなぐ・つくる・まもるの文言 | 保持し再配置 |
| 資料の存在・タイトル・説明・旧URL | 保持。取得不能な直接リンクは電話問い合わせ案内へ |
| 写真・ロゴ | 元URLを保持。未取得画像を実写として代替しない。サイト名の組版と装飾図版に変更。図版を正式ロゴ・実設備と称しない |
| トップ・CSS・メニュー | 全面刷新。事業→製造→理念/代表→会社→沿革→資料→相談 |
| 見積もりリンク | 通常CTAは contact へ。旧 harness-quote URLは静的な電話相談ページで保持 |
| 旧お知らせ3件 | 公開の事実・日付を再確認できずトップから除外。site.tsに保存 |
| 営業時間 | 根拠未確認のため非表示。最終確認事項に記録 |
| 旧プライバシー文 | 法的文面を改作しない。フォームを公開しないため旧ソースを保存し公開ルートから除外 |
| 管理画面・API・DB・認証・AI関連 | 元コード保存、公開ビルドから除外。今回稼働しない |
| public/__manus__ debug collector | archive/manus-runtime へ移動、distに含めない |
| 外部フォント・スクリプト | 公開ページから除外。システムフォント使用 |
| sitemap / 404 / favicon / SEO | ローカル資産と予定Pages URLで整備。公開自体は未実施 |

## 情報の根拠と未確定事項

既存 `CONTENT-UPDATE-GUIDE.md` を根拠とし、新たな会社能力・顧客・資格・実績を加えていない。公式サイトの検索結果で社名・事業・本社電話が一致。公式ページの直接取得は証明書エラーを返し、最新性を独立保証できない。

- 代表者、資本金、設立日、沿革は旧サイトを保持。社長による最新情報確認が必要。
- KES-STEP2は2011年の沿革として保持。現在有効とする文言・ロゴ・構造化データは追加しない。
- 写真/人物写真/PDFは元データと掲載許諾の再提供が必要。復旧前にダウンロード提供可能とは表現しない。
- 代表メッセージの掲載承認、資料提供可否、営業時間、公式ドメインとPagesの使い分けは公開前確認。
- さぬき市の `yutakaeng.com` は別企業。会社情報に混入していない。
