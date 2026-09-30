import { z } from "zod";

export const ActivityTypeSchema = z.enum(["call", "whatsapp", "meeting", "note", "email"]);
export type ActivityType = z.infer<typeof ActivityTypeSchema>;

export const ActivityDTOSchema = z.object({
  id: z.string(),
  organizationId: z.string().optional(),
  customerId: z.string(),
  customerName: z.string().optional(),
  dealId: z.string().optional(),
  dealTitle: z.string().optional(),
  type: ActivityTypeSchema.default("note"),
  title: z.string().min(2, "Judul aktivitas wajib diisi"),
  description: z.string().optional(),
  scheduledAt: z.string().optional(),
  completedAt: z.string().optional(),
  status: z.enum(["pending", "completed", "cancelled"]).default("completed"),
  assignedTo: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type ActivityDTO = z.infer<typeof ActivityDTOSchema>;

export const TimelineEventDTOSchema = z.object({
  id: z.string(),
  organizationId: z.string().optional(),
  customerId: z.string(),
  dealId: z.string().optional(),
  eventType: z.string(),
  summary: z.string().min(1, "Ringkasan event wajib diisi"),
  metadata: z.string().optional(),
  createdById: z.string().optional(),
  createdAt: z.string().optional(),
});
export type TimelineEventDTO = z.infer<typeof TimelineEventDTOSchema>;

export const CreateActivityInputSchema = ActivityDTOSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  dealTitle: true,
});
export type CreateActivityInput = z.infer<typeof CreateActivityInputSchema>;
