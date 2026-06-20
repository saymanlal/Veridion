import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as portfolioService from './portfolio.service';

export const getPortfolio = asyncHandler(async (req: Request, res: Response) => {
  const portfolio = await portfolioService.getPortfolio(req.user!.sub);
  res.json(portfolio);
});

export const getPrices = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ prices: portfolioService.getPrices() });
});

export const trade = asyncHandler(async (req: Request, res: Response) => {
  const result = await portfolioService.executeTrade(req.user!.sub, req.body);
  res.json({ ...result, success: true, message: 'Trade executed' });
});

export const replenish = asyncHandler(async (req: Request, res: Response) => {
  const result = await portfolioService.replenishCash(req.user!.sub, req.body);
  res.json(result);
});
