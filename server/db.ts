import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { quoteAttachments, quoteEstimateItems, quoteEstimates, quoteRequests, type InsertQuoteRequest, type InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { buildQuoteEstimateNumber } from "@shared/quoteEstimateNumber";

let database: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!database && process.env.DATABASE_URL) {
    database = drizzle(process.env.DATABASE_URL);
  }
  return database;
}

function requireDb(db: Awaited<ReturnType<typeof getDb>>) {
  if (!db) throw new Error("データベースに接続できません。時間をおいて再度お試しください。");
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field];
      updateSet[field] = user[field];
    }
  }
  // Preserve an administrator role that was assigned after the first login.
  // Only the configured owner is forcibly promoted during later sign-ins.
  values.role = user.openId === ENV.ownerOpenId ? "admin" : (user.role ?? "user");
  if (user.openId === ENV.ownerOpenId) {
    updateSet.role = "admin";
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function createQuoteRequest(values: InsertQuoteRequest) {
  const db = requireDb(await getDb());
  const result = await db.insert(quoteRequests).values(values);
  return Number(result[0].insertId);
}

export async function createQuoteSample() {
  return createQuoteRequest({
    requestType: "new",
    shape: "both-end",
    quantity: "確認用 25本",
    delivery: "2026年10月末",
    wire: "UL1007 AWG22、両端圧着",
    requirements: "導通検査（管理機能の確認用）",
    note: "この依頼は管理画面の検索・メモ・CSV出力を確認するためのサンプルです。確認後に削除できます。",
    companyName: "確認用サンプル株式会社",
    contactName: "管理画面 確認",
    email: "sample-quote@example.invalid",
    phone: "000-0000-0000",
    privacyAcceptedAt: new Date(),
    notificationStatus: "skipped",
    notificationNote: "管理画面の確認用データのため通知は送信していません。",
    isSample: true,
  });
}

export async function addQuoteAttachment(values: typeof quoteAttachments.$inferInsert) {
  const db = requireDb(await getDb());
  await db.insert(quoteAttachments).values(values);
}

export async function updateQuoteNotification(id: number, status: "skipped" | "sent" | "failed", note?: string) {
  const db = requireDb(await getDb());
  await db.update(quoteRequests).set({ notificationStatus: status, notificationNote: note ?? null }).where(eq(quoteRequests.id, id));
}

export async function listQuoteRequests() {
  const db = requireDb(await getDb());
  const requests = await db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt));
  const attachments = await db.select().from(quoteAttachments).orderBy(desc(quoteAttachments.createdAt));
  return requests.map((request) => ({ ...request, attachments: attachments.filter((attachment) => attachment.quoteRequestId === request.id) }));
}

export async function getQuoteRequestById(id: number) {
  const db = requireDb(await getDb());
  const request = await db.select().from(quoteRequests).where(eq(quoteRequests.id, id)).limit(1);
  if (!request[0]) return undefined;
  const attachments = await db.select().from(quoteAttachments).where(eq(quoteAttachments.quoteRequestId, id)).orderBy(desc(quoteAttachments.createdAt));
  return { ...request[0], attachments };
}

export async function getQuoteEstimate(quoteRequestId: number) {
  const db = requireDb(await getDb());
  const estimate = await db.select().from(quoteEstimates).where(eq(quoteEstimates.quoteRequestId, quoteRequestId)).limit(1);
  // tRPC/React Query cannot cache `undefined`; an absent draft is a valid empty state.
  if (!estimate[0]) return null;
  const items = await db.select().from(quoteEstimateItems).where(eq(quoteEstimateItems.estimateId, estimate[0].id)).orderBy(asc(quoteEstimateItems.sortOrder));
  return { ...estimate[0], items };
}

export type QuoteEstimateSaveInput = {
  quoteRequestId: number;
  estimateNumber?: string;
  issueDate: string;
  validUntil: string;
  taxRate: number;
  deliveryTerms?: string | null;
  paymentTerms?: string | null;
  notes?: string | null;
  items: Array<{ description: string; specification?: string | null; quantity: number; unit: string; unitPrice: number }>;
};

export async function saveQuoteEstimate(input: QuoteEstimateSaveInput) {
  const db = requireDb(await getDb());
  return db.transaction(async (tx) => {
    const existing = await tx.select({ id: quoteEstimates.id }).from(quoteEstimates).where(eq(quoteEstimates.quoteRequestId, input.quoteRequestId)).limit(1);
    const baseValues = { issueDate: input.issueDate, validUntil: input.validUntil, taxRate: input.taxRate, deliveryTerms: input.deliveryTerms ?? null, paymentTerms: input.paymentTerms ?? null, notes: input.notes ?? null };
    let estimateId = existing[0]?.id;
    let estimateNumber = "";
    if (!estimateId) {
      const result = await tx.insert(quoteEstimates).values({ ...baseValues, estimateNumber: `PENDING-${Date.now()}`, quoteRequestId: input.quoteRequestId });
      estimateId = Number(result[0].insertId);
      estimateNumber = buildQuoteEstimateNumber(estimateId);
      await tx.update(quoteEstimates).set({ estimateNumber }).where(eq(quoteEstimates.id, estimateId));
    } else {
      const current = await tx.select({ estimateNumber: quoteEstimates.estimateNumber }).from(quoteEstimates).where(eq(quoteEstimates.id, estimateId)).limit(1);
      estimateNumber = current[0]?.estimateNumber ?? buildQuoteEstimateNumber(estimateId);
      await tx.update(quoteEstimates).set({ ...baseValues, estimateNumber }).where(eq(quoteEstimates.id, estimateId));
    }
    await tx.delete(quoteEstimateItems).where(eq(quoteEstimateItems.estimateId, estimateId));
    await tx.insert(quoteEstimateItems).values(input.items.map((item, index) => ({ estimateId, sortOrder: index, description: item.description, specification: item.specification ?? null, quantity: item.quantity, unit: item.unit, unitPrice: item.unitPrice })));
    return { estimateId, estimateNumber };
  });
}

export async function setQuoteStatus(id: number, status: "new" | "reviewing" | "quoted" | "closed") {
  const db = requireDb(await getDb());
  await db.update(quoteRequests).set({ status }).where(eq(quoteRequests.id, id));
}

export async function setQuoteAdminNote(id: number, adminNote: string) {
  const db = requireDb(await getDb());
  await db.update(quoteRequests).set({ adminNote: adminNote || null }).where(eq(quoteRequests.id, id));
}

export async function deleteQuoteSample(id: number) {
  const db = requireDb(await getDb());
  await db.delete(quoteRequests).where(and(eq(quoteRequests.id, id), eq(quoteRequests.isSample, true)));
}
