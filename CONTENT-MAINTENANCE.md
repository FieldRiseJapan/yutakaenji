# コンテンツと見積もり機能の保守マップ

このプロジェクトは、文章・連絡先・最新情報・将来のハーネス見積もり質問を、画面の見た目から分けて管理します。**文言だけを変えたい場合は、原則として `client/src/content/` 配下だけを編集します。**

| 変更したい内容 | 編集するファイル | 代表的な項目 |
|---|---|---|
| 社名、電話番号、住所、事業内容、沿革、最新情報 | `client/src/content/site.ts` | `companyName`、`phone`、`announcements`、`businesses`、`timeline` |
| 代表メッセージ・代表者名・掲載文章 | `client/src/content/site.ts` | `message` |
| 将来のハーネス見積もりフォームの文言・質問 | `client/src/content/harnessQuote.ts` | `title`、`lead`、`steps`、`questions` |
| トップの最新情報帯の表示部品 | `client/src/components/NewsStrip.tsx` | 見出しや表示順の変更 |
| 各章の見出し表示部品 | `client/src/components/SectionHeading.tsx` | 章番号・ラベルの見せ方 |
| ページの並び順・各セクションの文章位置 | `client/src/pages/Home.tsx` | セクションの追加・削除・並び替え |
| 配色、余白、文字サイズ、レスポンシブ表示 | `client/src/index.css` | CSSクラスとメディアクエリ |

## よくある変更例

### 最新情報を1件追加する

`client/src/content/site.ts` の `announcements` に、次の形で1件追加します。

```ts
{
  date: "2026.09.01",
  category: "NEWS",
  title: "お知らせの見出しをここに入力します。",
  href: "#contact",
}
```

### ハーネス見積もりの質問を変える

`client/src/content/harnessQuote.ts` の `steps` 内にある `questions` を編集します。質問文は `label`、補足説明は `hint`、必須・任意は `required` で変更します。選択肢の追加・削除は `choices` を編集します。

### フォーム実装時の注意

現時点の `harnessQuote.ts` は、**フォーム質問を先に確定するための設定ファイル**です。実際に図面や写真を受け付けるときは、安全なファイル保管、受付通知、個人情報の取扱いが必要です。そのため、フォーム実装時には静的サイトのままではなく、ファイル保管とサーバー処理を追加した構成へ移行します。

## 編集後の確認

文章・設定を更新したら、ローカルで `pnpm check` と `pnpm build` を実行し、表示を確認してからGitHubへ反映します。コードを触らず文章だけを直す場合も、余白や改行が画面幅によって崩れていないか、PCとスマートフォンの両方で確認してください。
