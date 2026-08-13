import { quoteManagementConfig, quoteStatusLabels, type QuoteStatusValue } from "../content/quoteManagement";

export type QuoteCsvRecord = {
  id: number;
  createdAt: Date | string;
  status: QuoteStatusValue;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  requestType: string;
  shape: string | null;
  quantity: string;
  delivery: string;
  adminNote: string | null;
  notificationStatus: string;
};

function toCsvCell(value: unknown) {
  const text = String(value ?? "");
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function buildQuoteCsv(quotes: QuoteCsvRecord[]) {
  const rows = quotes.map((quote) => [
    quote.id,
    new Date(quote.createdAt).toLocaleString("ja-JP"),
    quoteStatusLabels[quote.status],
    quote.companyName,
    quote.contactName,
    quote.email,
    quote.phone,
    quote.requestType,
    quote.shape || "",
    quote.quantity,
    quote.delivery,
    quote.adminNote || "",
    quote.notificationStatus,
  ]);
  return `\uFEFF${[quoteManagementConfig.csv.headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\r\n")}`;
}
