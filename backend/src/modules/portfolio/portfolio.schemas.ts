import { z } from 'zod';

export const tradeSchema = z.object({
  asset: z.enum(['BTC', 'ETH', 'VRD']),
  action: z.enum(['BUY', 'SELL']),
  volume: z.number().positive('Volume must be greater than zero'),
});

export const replenishSchema = z.object({
  amount: z.number().positive().max(1_000_000).optional(),
});

export type TradeInput = z.infer<typeof tradeSchema>;
export type ReplenishInput = z.infer<typeof replenishSchema>;
