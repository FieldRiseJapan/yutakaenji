import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { quoteAttachments, quoteRequests, type InsertQuoteRequest, type InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

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
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
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

export async function setQuoteStatus(id: number, status: "new" | "reviewing" | "quoted" | "closed") {
  const db = requireDb(await getDb());
  await db.update(quoteRequests).set({ status }).where(eq(quoteRequests.id, id));
}
