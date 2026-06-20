import { z } from 'zod';

export const updateNameSchema = z.object({
  newName: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

export type UpdateNameInput = z.infer<typeof updateNameSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
