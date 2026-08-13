import { afterEach, describe, expect, it, vi } from "vitest";
import { notifyQuoteRequest, quoteNotificationConfig } from "./quoteNotification";

const originalSettings = { ...quoteNotificationConfig };
const originalApiKey = process.env.RESEND_API_KEY;

const payload = {
  requestId: 1,
  companyName: "株式会社ユタカエンジニアリング",
  contactName: "テスト担当者",
  customerEmail: "customer@example.com",
  requestType: "new",
  quantity: "10本",
  delivery: "未定",
};

afterEach(() => {
  Object.assign(quoteNotificationConfig, originalSettings);
  process.env.RESEND_API_KEY = originalApiKey;
  vi.unstubAllGlobals();
});

describe("quote notification settings", () => {
  it("keeps a request safe when the responsible mailbox is not set", async () => {
    quoteNotificationConfig.recipientEmail = "";
    const result = await notifyQuoteRequest(payload);
    expect(result).toEqual({ status: "skipped", reason: "担当者メールアドレスが未設定です" });
  });

  it("sends a staff notification and a customer acknowledgement when all settings are ready", async () => {
    quoteNotificationConfig.recipientEmail = "staff@example.com";
    quoteNotificationConfig.senderEmail = "quote@example.com";
    quoteNotificationConfig.replyToEmail = "staff@example.com";
    process.env.RESEND_API_KEY = "re_test_key";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const result = await notifyQuoteRequest(payload);

    expect(result).toEqual({ status: "sent" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ to: ["staff@example.com"], reply_to: "staff@example.com" });
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({ to: ["customer@example.com"] });
  });

  it("records a failed status when either of the two email deliveries fails", async () => {
    quoteNotificationConfig.recipientEmail = "staff@example.com";
    quoteNotificationConfig.senderEmail = "quote@example.com";
    process.env.RESEND_API_KEY = "re_test_key";
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: true }).mockResolvedValueOnce({ ok: false, status: 422 });
    vi.stubGlobal("fetch", fetchMock);

    const result = await notifyQuoteRequest(payload);

    expect(result.status).toBe("failed");
    expect(result.reason).toContain("受付完了メール: failed");
  });
});
