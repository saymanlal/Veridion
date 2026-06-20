import { Router } from 'express';
import { optionalAuth, requireAuth } from '../../middleware/auth';
import { ticketRateLimiter } from '../../middleware/rateLimit';
import { validateBody } from '../../middleware/validate';
import { ticketUpload } from '../../utils/upload';
import * as controller from './support.controller';
import { createTicketSchema } from './support.schemas';

export const supportRouter = Router();

supportRouter.post(
  '/',
  ticketRateLimiter,
  optionalAuth,
  ticketUpload.array('attachments', 5),
  validateBody(createTicketSchema),
  controller.createTicket,
);

supportRouter.get('/', requireAuth, controller.listTickets);
supportRouter.get('/track/:displayId', controller.trackTicket);
supportRouter.get('/:ticketId', requireAuth, controller.getTicket);
supportRouter.get('/:ticketId/attachments/:filename', requireAuth, controller.getAttachment);
