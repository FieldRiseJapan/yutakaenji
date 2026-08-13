import { describe, expect, it } from "vitest";
import { notifyQuoteRequest, quoteNotificationConfig } from "./quoteNotification";

describe("quote notification settings", () => {
  it("keeps a request safe when the responsible mailbox is not set", async () => {
    const originalRecipient = quoteNotificationConfig.recipientEmail;
    quoteNotificationConfig.recipientEmail = "";

    const result = await notifyQuoteRequest({
      requestId: 1,
      companyName: "株式会社ユタカエンジニアリング",
      contactName: "テスト担当者",
      requestType: "new",
      quantity: "10本",
      delivery: "未定",
    });

    quoteNotificationConfig.recipientEmail = originalRecipient;
    expect(result).toEqual({ status: "skipped", reason: "担当者メールアドレスが未設定です" });
  });
});
