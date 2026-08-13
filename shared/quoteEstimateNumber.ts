/** 見積書番号の接頭辞と連番桁数はここで変更できます。 */
export const quoteEstimateNumberConfig = {
  prefix: "YEK",
  digits: 5,
} as const;

export function buildQuoteEstimateNumber(id: number, issuedAt = new Date()) {
  const period = `${issuedAt.getFullYear()}${String(issuedAt.getMonth() + 1).padStart(2, "0")}`;
  return `${quoteEstimateNumberConfig.prefix}-${period}-${String(id).padStart(quoteEstimateNumberConfig.digits, "0")}`;
}
