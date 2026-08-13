import { describe, expect, it } from "vitest";
import { buildQuoteCsv } from "./quoteCsv";

describe("buildQuoteCsv", () => {
  it("writes the configured headers, selected rows, and guards spreadsheet formula cells", () => {
    const csv = buildQuoteCsv([{
      id: 12,
      createdAt: "2026-08-13T00:00:00.000Z",
      status: "new",
      companyName: "=SYSTEM_TEST",
      contactName: "検証担当",
      email: "test@example.invalid",
      phone: "000-0000-0000",
      requestType: "new",
      shape: "wire",
      quantity: "10本",
      delivery: "未定",
      adminNote: "折り返し希望",
      notificationStatus: "skipped",
    }]);
    expect(csv).toContain('"受付番号"');
    expect(csv).toContain('"担当者メモ"');
    expect(csv).toContain('"\'=SYSTEM_TEST"');
    expect(csv).toContain('"折り返し希望"');
  });
});
