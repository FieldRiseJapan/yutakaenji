/** Quote notification settings: leave the recipient blank until the responsible person's mailbox is determined. */
type QuoteNotificationPayload = {
  requestId: number;
  companyName: string;
  contactName: string;
  requestType: string;
  quantity: string;
  delivery: string;
};

export const quoteNotificationConfig = {
  /** Set this to the responsible person's mailbox when the operational contact is finalized. */
  recipientEmail: "",
  /** Set a verified sender address when RESEND_API_KEY is configured. */
  senderEmail: "",
  provider: "resend" as const,
};

export type NotificationResult = {
  status: "skipped" | "sent" | "failed";
  reason?: string;
};

export async function notifyQuoteRequest(payload: QuoteNotificationPayload): Promise<NotificationResult> {
  const recipient = quoteNotificationConfig.recipientEmail.trim();
  const sender = quoteNotificationConfig.senderEmail.trim();
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!recipient) {
    return { status: "skipped", reason: "担当者メールアドレスが未設定です" };
  }

  if (!sender || !apiKey) {
    return { status: "skipped", reason: "メール送信サービスの設定が未完了です" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        subject: `【見積もり依頼 #${payload.requestId}】ハーネス加工のご相談`,
        text: [
          "ハーネス加工の見積もり依頼を受け付けました。",
          `受付番号: #${payload.requestId}`,
          `会社名: ${payload.companyName}`,
          `担当者: ${payload.contactName}`,
          `ご相談内容: ${payload.requestType}`,
          `希望数量: ${payload.quantity}`,
          `希望納期: ${payload.delivery}`,
          "管理画面から依頼内容と添付資料をご確認ください。",
        ].join("\n"),
      }),
    });

    if (!response.ok) {
      return { status: "failed", reason: `メール送信サービスが応答しました (${response.status})` };
    }

    return { status: "sent" };
  } catch (error) {
    return { status: "failed", reason: error instanceof Error ? error.message : "メール送信に失敗しました" };
  }
}
