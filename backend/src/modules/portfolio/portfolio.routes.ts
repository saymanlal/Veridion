import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import * as controller from './portfolio.controller';
import { replenishSchema, tradeSchema } from './portfolio.schemas';

export const portfolioRouter = Router();

portfolioRouter.use(requireAuth);
portfolioRouter.get('/', controller.getPortfolio);
portfolioRouter.get('/prices', controller.getPrices);
portfolioRouter.post('/trade', validateBody(tradeSchema), controller.trade);
portfolioRouter.post('/cash-replenish', validateBody(replenishSchema), controller.replenish);
