import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  database: {
    createQuoteRequest: vi.fn(),
    addQuoteAttachment: vi.fn(),
    updateQuoteNotification: vi.fn(),
    listQuoteRequests: vi.fn(),
    setQuoteStatus: vi.fn(),
  },
  storage: { storagePut: vi.fn() },
  notification: { notifyQuoteRequest: vi.fn() },
}));

vi.mock("./db", () => mocks.database);
vi.mock("./storage", () => mocks.storage);
vi.mock("./quoteNotification", () => mocks.notification);

import { appRouter } from "./routers";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("quote.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.database.createQuoteRequest.mockResolvedValue(42);
    mocks.database.addQuoteAttachment.mockResolvedValue(undefined);
    mocks.database.updateQuoteNotification.mockResolvedValue(undefined);
    mocks.storage.storagePut.mockResolvedValue({ key: "quotes/42/drawing_abc.pdf", url: "/manus-storage/quotes/42/drawing_abc.pdf" });
    mocks.notification.notifyQuoteRequest.mockResolvedValue({ status: "skipped", reason: "担当者メールアドレスが未設定です" });
  });

  it("saves a public quote, stores its attachment, and skips notification safely when the mailbox is blank", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.quote.submit({
      requestType: "new",
      shape: "both-end",
      quantity: "100本",
      delivery: "2026年9月末",
      companyName: "株式会社テスト",
      contactName: "見積 太郎",
      email: "quote@example.com",
      phone: "087-000-0000",
      files: [{ name: "図面 01.pdf", type: "application/pdf", size: 4, data: Buffer.from("test").toString("base64") }],
    });

    expect(result).toEqual({ requestId: 42, notificationStatus: "skipped" });
    expect(mocks.database.createQuoteRequest).toHaveBeenCalledWith(expect.objectContaining({ companyName: "株式会社テスト", notificationStatus: "skipped" }));
    expect(mocks.storage.storagePut).toHaveBeenCalledWith("quotes/42/___01.pdf", expect.any(Buffer), "application/pdf");
    expect(mocks.database.addQuoteAttachment).toHaveBeenCalledWith(expect.objectContaining({ quoteRequestId: 42, originalName: "図面 01.pdf" }));
    expect(mocks.database.updateQuoteNotification).toHaveBeenCalledWith(42, "skipped", "担当者メールアドレスが未設定です");
  });
});
