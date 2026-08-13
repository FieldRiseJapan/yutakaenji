/** Future quote form: edit this file to change harness estimate questions without changing the UI implementation. */
export type QuoteChoice = {
  label: string;
  value: string;
};

export type QuoteQuestion = {
  id: string;
  label: string;
  hint?: string;
  required: boolean;
  type: "choice" | "text" | "textarea" | "file";
  choices?: readonly QuoteChoice[];
};

export const harnessQuoteConfig = {
  title: "ハーネス加工のお見積もり・ご相談",
  lead: "図面がなくても、分かる範囲でお聞かせください。手書きのスケッチや既存品の写真からもご相談いただけます。",
  responseGuide: "内容を確認のうえ、担当者より1営業日以内を目安にご連絡します。",
  steps: [
    {
      id: "request",
      title: "ご相談内容",
      questions: [
        {
          id: "requestType",
          label: "ご相談内容",
          required: true,
          type: "choice",
          choices: [
            { label: "新規製作", value: "new" },
            { label: "既存品の追加製作", value: "repeat" },
            { label: "仕様変更", value: "revision" },
            { label: "まず相談したい", value: "consult" },
          ],
        },
        {
          id: "shape",
          label: "おおよその形状",
          hint: "分かる範囲で選択してください。",
          required: false,
          type: "choice",
          choices: [
            { label: "電線のみ", value: "wire" },
            { label: "片側端末・コネクタ", value: "one-end" },
            { label: "両側端末・コネクタ", value: "both-end" },
            { label: "未定", value: "unknown" },
          ],
        },
      ],
    },
    {
      id: "specification",
      title: "仕様と希望条件",
      questions: [
        { id: "quantity", label: "希望数量", hint: "例: 試作10本、初回100本、月産500本", required: true, type: "text" },
        { id: "delivery", label: "希望納期", hint: "例: 2026年9月末、未定", required: true, type: "text" },
        { id: "wire", label: "電線・コネクタ・端末の仕様", hint: "型番、長さ、色、端末処理など", required: false, type: "textarea" },
        {
          id: "priority",
          label: "優先したい条件",
          required: false,
          type: "choice",
          choices: [
            { label: "納期", value: "delivery" },
            { label: "価格", value: "cost" },
            { label: "品質・規格", value: "quality" },
          ],
        },
      ],
    },
    {
      id: "files",
      title: "資料と連絡先",
      questions: [
        { id: "drawing", label: "図面・部品表・写真", hint: "PDF、図面、部品表、写真、手書きスケッチなど", required: false, type: "file" },
        { id: "note", label: "補足事項", required: false, type: "textarea" },
        { id: "company", label: "会社名", required: true, type: "text" },
        { id: "contact", label: "ご担当者名・連絡先", required: true, type: "text" },
      ],
    },
  ],
} as const;
