import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, unique, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "user"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const quoteStatusValues = ["new", "reviewing", "quoted", "closed"] as const;

export const quoteRequests = mysqlTable("quote_requests", {
  id: int("id").autoincrement().primaryKey(),
  requestType: varchar("requestType", { length: 32 }).notNull(),
  shape: varchar("shape", { length: 32 }),
  quantity: varchar("quantity", { length: 120 }).notNull(),
  delivery: varchar("delivery", { length: 120 }).notNull(),
  wire: text("wire"),
  priority: varchar("priority", { length: 32 }),
  materialFlexibility: varchar("materialFlexibility", { length: 32 }),
  requirements: text("requirements"),
  note: text("note"),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }).notNull(),
  privacyAcceptedAt: timestamp("privacyAcceptedAt").notNull(),
  adminNote: text("adminNote"),
  isSample: boolean("isSample").default(false).notNull(),
  notificationStatus: mysqlEnum("notificationStatus", ["skipped", "sent", "failed"]).default("skipped").notNull(),
  notificationNote: varchar("notificationNote", { length: 500 }),
  status: mysqlEnum("status", quoteStatusValues).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const quoteAttachments = mysqlTable("quote_attachments", {
  id: int("id").autoincrement().primaryKey(),
  quoteRequestId: int("quoteRequestId").notNull().references(() => quoteRequests.id, { onDelete: "cascade" }),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 600 }).notNull(),
  originalName: varchar("originalName", { length: 500 }).notNull(),
  contentType: varchar("contentType", { length: 160 }).notNull(),
  byteSize: int("byteSize").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const quoteEstimates = mysqlTable("quote_estimates", {
  id: int("id").autoincrement().primaryKey(),
  quoteRequestId: int("quoteRequestId").notNull().references(() => quoteRequests.id, { onDelete: "cascade" }),
  estimateNumber: varchar("estimateNumber", { length: 80 }).notNull(),
  issueDate: varchar("issueDate", { length: 32 }).notNull(),
  validUntil: varchar("validUntil", { length: 80 }).notNull(),
  taxRate: int("taxRate").default(10).notNull(),
  deliveryTerms: text("deliveryTerms"),
  paymentTerms: text("paymentTerms"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [unique("quote_estimates_quote_request_unique").on(table.quoteRequestId), unique("quote_estimates_estimate_number_unique").on(table.estimateNumber)]);

export const quoteEstimateItems = mysqlTable("quote_estimate_items", {
  id: int("id").autoincrement().primaryKey(),
  estimateId: int("estimateId").notNull().references(() => quoteEstimates.id, { onDelete: "cascade" }),
  sortOrder: int("sortOrder").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  specification: text("specification"),
  quantity: int("quantity").default(1).notNull(),
  unit: varchar("unit", { length: 32 }).default("式").notNull(),
  unitPrice: int("unitPrice").default(0).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type InsertQuoteRequest = typeof quoteRequests.$inferInsert;
export type InsertQuoteEstimate = typeof quoteEstimates.$inferInsert;
