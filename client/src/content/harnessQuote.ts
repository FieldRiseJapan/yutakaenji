/** Harness quote draft: change questions and notification copy here without changing the page implementation. */
export type QuoteChoice = {
  label: string;
  value: string;
};

export type QuoteQuestion = {
  id: string;
  label: string;
  hint?: string;
  required: boolean;
  type: "choice" | "text" | "email" | "tel" | "textarea" | "file";
  choices?: readonly QuoteChoice[];
};

export const harnessQuoteConfig = {
  title: "ハーネス加工のお見積もり・ご相談",
  label: "HARNESS QUOTE / DRAFT",
  lead: "図面がなくても、分かる範囲でお聞かせください。手書きのスケッチや既存品の写真からもご相談いただけます。",
  responseGuide: "内容を確認のうえ、担当者より1営業日以内を目安にご連絡します。確定価格の自動表示は行いません。",
  attachmentGuide: "PDF、DXF、DWG、Excel、画像、ZIPを3ファイル・合計10MBまで添付できます。",
  privacy: {
    consentLabel: "個人情報の取扱いに同意して依頼内容を送信する",
    consentRequiredMessage: "個人情報の取扱いへの同意が必要です。",
    linkLabel: "個人情報の取扱いについて",
  },
  maxFiles: 3,
  maxTotalBytes: 10 * 1024 * 1024,
  allowedExtensions: ["pdf", "dxf", "dwg", "xls", "xlsx", "zip", "jpg", "jpeg", "png", "webp"],
  acceptedFileTypes: [
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/acad",
    "application/dxf",
    "image/vnd.dwg",
  ],
  steps: [
    {
      id: "request",
      title: "ご相談内容",
      description: "まずは案件の状態と、おおよその形状をお選びください。",
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
      description: "図面がある場合は、次の画面で添付できます。分かる項目だけご記入ください。",
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
        {
          id: "materialFlexibility",
          label: "材料・コネクタの代替提案",
          hint: "指定がない場合、納期やコストの観点から代替案をご提案できる場合があります。",
          required: false,
          type: "choice",
          choices: [
            { label: "代替提案を受けたい", value: "allowed" },
            { label: "指定品のみ希望", value: "fixed" },
            { label: "相談したい", value: "consult" },
          ],
        },
        { id: "requirements", label: "必要な規格・検査・用途", hint: "例: RoHS、UL、導通検査、使用設備など", required: false, type: "textarea" },
      ],
    },
    {
      id: "contact",
      title: "資料と連絡先",
      description: "最後に、資料とご連絡先をお預かりします。",
      questions: [
        { id: "drawing", label: "図面・部品表・写真", hint: "正式図面でなくても構いません。", required: false, type: "file" },
        { id: "note", label: "補足事項", required: false, type: "textarea" },
        { id: "companyName", label: "会社名", required: true, type: "text" },
        { id: "contactName", label: "ご担当者名", required: true, type: "text" },
        { id: "email", label: "メールアドレス", required: true, type: "email" },
        { id: "phone", label: "電話番号", required: true, type: "tel" },
      ],
    },
  ],
} as const;
