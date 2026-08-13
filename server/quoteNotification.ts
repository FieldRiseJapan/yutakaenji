/** Quote notification settings: fill in verified addresses after the operational owner and sender domain are finalized. */
type QuoteNotificationPayload = {
  requestId: number;
  companyName: string;
  contactName: string;
  customerEmail: string;
  requestType: string;
  quantity: string;
  delivery: string;
};

export const quoteNotificationConfig = {
  /** Set this to the responsible person's mailbox when the operational contact is finalized. */
  recipientEmail: "",
  /** Set a verified sender address when RESEND_API_KEY is configured. */
  senderEmail: "",
  /** Optional: use the responsible mailbox as Reply-To if customer replies should bypass the sender mailbox. */
  replyToEmail: "",
  provider: "resend" as const,
};

export type NotificationResult = {
  status: "skipped" | "sent" | "failed";
  reason?: string;
};

type MailRequest = {
  to: string;
  subject: string;
  text: string;
};

function formatRequestType(value: string) {
  const labels: Record<string, string> = {
    new: "新規製作",
    repeat: "既存品の追加製作",
    revision: "仕様変更",
    consult: "まず相談したい",
  };
  return labels[value] ?? value;
}

async function sendMail(request: MailRequest, apiKey: string, sender: string, replyTo: string): Promise<NotificationResult> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [request.to],
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject: request.subject,
        text: request.text,
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

export async function notifyQuoteRequest(payload: QuoteNotificationPayload): Promise<NotificationResult> {
  const recipient = quoteNotificationConfig.recipientEmail.trim();
  const sender = quoteNotificationConfig.senderEmail.trim();
  const replyTo = quoteNotificationConfig.replyToEmail.trim();
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!recipient) {
    return { status: "skipped", reason: "担当者メールアドレスが未設定です" };
  }
  if (!sender || !apiKey) {
    return { status: "skipped", reason: "メール送信サービスの設定が未完了です" };
  }

  const requestType = formatRequestType(payload.requestType);
  const [staff, customer] = await Promise.all([
    sendMail({
      to: recipient,
      subject: `【見積もり依頼 #${payload.requestId}】ハーネス加工のご相談`,
      text: [
        "ハーネス加工の見積もり依頼を受け付けました。",
        `受付番号: #${payload.requestId}`,
        `会社名: ${payload.companyName}`,
        `担当者: ${payload.contactName}`,
        `メール: ${payload.customerEmail}`,
        `ご相談内容: ${requestType}`,
        `希望数量: ${payload.quantity}`,
        `希望納期: ${payload.delivery}`,
        "管理画面から依頼内容と添付資料をご確認ください。",
      ].join("\n"),
    }, apiKey, sender, replyTo),
    sendMail({
      to: payload.customerEmail,
      subject: `【株式会社ユタカエンジニアリング】お見積もり・ご相談を受け付けました（受付番号 #${payload.requestId}）`,
      text: [
        `${payload.companyName} ${payload.contactName} 様`,
        "",
        "このたびは、株式会社ユタカエンジニアリングへお問い合わせいただき、ありがとうございます。",
        "ハーネス加工のお見積もり・ご相談を受け付けました。",
        "内容を確認のうえ、担当者より1営業日以内を目安にご連絡します。",
        "",
        `受付番号: #${payload.requestId}`,
        `ご相談内容: ${requestType}`,
        `希望数量: ${payload.quantity}`,
        `希望納期: ${payload.delivery}`,
        "",
        "本メールは送信専用です。ご不明点がございましたら、お電話またはお問い合わせフォームからご連絡ください。",
        "",
        "株式会社ユタカエンジニアリング",
        "香川県高松市",
      ].join("\n"),
    }, apiKey, sender, replyTo),
  ]);

  if (staff.status === "sent" && customer.status === "sent") return { status: "sent" };

  const details = [
    `担当者通知: ${staff.status}${staff.reason ? `（${staff.reason}）` : ""}`,
    `受付完了メール: ${customer.status}${customer.reason ? `（${customer.reason}）` : ""}`,
  ].join(" / ");
  return { status: "failed", reason: details };
}
