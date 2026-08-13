import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { addQuoteAttachment, createQuoteRequest, listQuoteRequests, setQuoteStatus, updateQuoteNotification } from "./db";
import { notifyQuoteRequest } from "./quoteNotification";
import { storagePut } from "./storage";

const quoteStatus = z.enum(["new", "reviewing", "quoted", "closed"]);
const fileInput = z.object({
  name: z.string().min(1).max(500),
  type: z.string().min(1).max(160),
  size: z.number().int().positive().max(10 * 1024 * 1024),
  data: z.string().min(1),
});

const quoteInput = z.object({
  requestType: z.string().min(1).max(32),
  shape: z.string().max(32).optional(),
  quantity: z.string().min(1).max(120),
  delivery: z.string().min(1).max(120),
  wire: z.string().max(12000).optional(),
  priority: z.string().max(32).optional(),
  materialFlexibility: z.string().max(32).optional(),
  requirements: z.string().max(12000).optional(),
  note: z.string().max(12000).optional(),
  companyName: z.string().min(1).max(255),
  contactName: z.string().min(1).max(255),
  email: z.string().email().max(320),
  phone: z.string().min(6).max(64),
  files: z.array(fileInput).max(3),
});

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "attachment";
}

const allowedAttachmentExtensions = new Set(["pdf", "dxf", "dwg", "xls", "xlsx", "zip", "jpg", "jpeg", "png", "webp"]);

function hasAllowedAttachmentExtension(name: string) {
  const extension = name.split(".").pop()?.toLowerCase();
  return extension !== undefined && allowedAttachmentExtensions.has(extension);
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  quote: router({
    submit: publicProcedure.input(quoteInput).mutation(async ({ input }) => {
      const totalBytes = input.files.reduce((total, file) => total + file.size, 0);
      if (totalBytes > 10 * 1024 * 1024) throw new Error("添付ファイルの合計は10MBまでです。");

      const requestId = await createQuoteRequest({
        requestType: input.requestType,
        shape: input.shape ?? null,
        quantity: input.quantity,
        delivery: input.delivery,
        wire: input.wire ?? null,
        priority: input.priority ?? null,
        materialFlexibility: input.materialFlexibility ?? null,
        requirements: input.requirements ?? null,
        note: input.note ?? null,
        companyName: input.companyName,
        contactName: input.contactName,
        email: input.email,
        phone: input.phone,
        notificationStatus: "skipped",
      });

      for (const file of input.files) {
        if (!hasAllowedAttachmentExtension(file.name)) {
          throw new Error(`${file.name} は対応していない形式です。`);
        }
        const data = Buffer.from(file.data, "base64");
        if (data.length !== file.size) throw new Error(`${file.name} のサイズを確認できませんでした。`);
        const stored = await storagePut(`quotes/${requestId}/${safeFileName(file.name)}`, data, file.type);
        await addQuoteAttachment({ quoteRequestId: requestId, fileKey: stored.key, fileUrl: stored.url, originalName: file.name, contentType: file.type, byteSize: file.size });
      }

      const notification = await notifyQuoteRequest({ requestId, companyName: input.companyName, contactName: input.contactName, requestType: input.requestType, quantity: input.quantity, delivery: input.delivery });
      await updateQuoteNotification(requestId, notification.status, notification.reason);
      return { requestId, notificationStatus: notification.status };
    }),
    list: adminProcedure.query(() => listQuoteRequests()),
    updateStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: quoteStatus })).mutation(async ({ input }) => {
      await setQuoteStatus(input.id, input.status);
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
