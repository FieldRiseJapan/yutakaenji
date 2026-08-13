import { site } from "./site";
import { quoteEstimateNumberConfig } from "@shared/quoteEstimateNumber";

/** 見積書の会社情報・定型文・初期値はここだけを編集してください。 */
export const quoteEstimateConfig = {
  issuer: {
    name: site.companyName,
    address: site.address,
    phone: site.phone,
  },
  defaults: {
    validUntil: "発行日より30日間",
    taxRate: 10,
    deliveryTerms: "ご注文内容の確定後、別途ご案内いたします。",
    paymentTerms: "お支払条件は別途ご相談のうえ決定いたします。",
    notes: "本書は見積もり下書きです。仕様・数量・納期・金額はご発注前に最終確認をお願いいたします。",
  },
  labels: {
    draft: "見積書（下書き）",
    print: "PDFとして保存・印刷",
    save: "下書きを保存",
    addItem: "明細を追加",
  },
  number: {
    pending: "保存時に自動採番されます",
    prefix: quoteEstimateNumberConfig.prefix,
  },
} as const;

export function formatYen(value: number) {
  return `${new Intl.NumberFormat("ja-JP").format(value)} 円`;
}
