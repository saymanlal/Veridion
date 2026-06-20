import { z } from 'zod';

const TICKET_CATEGORIES = [
  'Transaction issues',
  'Account access problems',
  'App bugs',
  'Payment/deposit issues',
  'Other',
] as const;

export const createTicketSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  category: z.enum(TICKET_CATEGORIES),
  subject: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(5000),
  emailNotifications: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((value) => (value === undefined ? true : typeof value === 'boolean' ? value : value === 'true')),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
