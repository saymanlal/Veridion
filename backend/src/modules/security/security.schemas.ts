import { z } from 'zod';

export const lockTimeoutSchema = z.object({
  lockTimeoutSeconds: z.union([z.literal(15), z.literal(30), z.literal(60), z.literal(180), z.literal(300)]),
});

export const unlockSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export const enable2faSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

export const disable2faSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export const auditLogQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25),
});

export type LockTimeoutInput = z.infer<typeof lockTimeoutSchema>;
export type UnlockInput = z.infer<typeof unlockSchema>;
export type Enable2faInput = z.infer<typeof enable2faSchema>;
export type Disable2faInput = z.infer<typeof disable2faSchema>;
