/** Edit management-screen labels, filters, CSV columns, and memo copy here without changing the screen implementation. */
export const quoteStatusValues = ["new", "reviewing", "quoted", "closed"] as const;
export type QuoteStatusValue = (typeof quoteStatusValues)[number];

export const quoteStatusLabels: Record<QuoteStatusValue, string> = {
  new: "新規",
  reviewing: "確認中",
  quoted: "見積回答済",
  closed: "完了",
};

export const quoteManagementConfig = {
  labels: {
    searchPlaceholder: "会社名・担当者名・メール・メモで検索",
    searchAriaLabel: "見積もり依頼を検索",
    allStatuses: "すべての状況",
    receivedDate: "受付日",
    clearFilters: "条件をクリア",
    exportCsv: "CSV出力",
    resultCountSuffix: "件を表示中",
    noResults: "条件に一致する見積もり依頼はありません。",
  },
  memo: {
    title: "担当者メモ",
    placeholder: "折り返し時刻、確認事項、見積もり方針などを記録",
    save: "メモを保存",
    saving: "保存中…",
  },
  csv: {
    filePrefix: "harness-quotes",
    headers: ["受付番号", "受付日時", "対応状況", "会社名", "担当者名", "メールアドレス", "電話番号", "相談内容", "形状", "希望数量", "希望納期", "担当者メモ", "通知状態"],
  },
} as const;
