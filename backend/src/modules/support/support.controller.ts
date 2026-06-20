import type { Request, Response } from 'express';
import path from 'path';
import { asyncHandler } from '../../utils/asyncHandler';
import { UPLOAD_DIRECTORY } from '../../utils/upload';
import * as supportService from './support.service';

export const createTicket = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const ticket = await supportService.createTicket(req.user?.sub, req.body, files);
  res.status(201).json({ ticket, message: 'Ticket submitted' });
});

export const listTickets = asyncHandler(async (req: Request, res: Response) => {
  const tickets = await supportService.listTickets(req.user!.sub);
  res.json({ tickets, total: tickets.length });
});

export const getTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await supportService.getTicket(req.user!.sub, req.params.ticketId);
  res.json({ ticket });
});

export const trackTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await supportService.trackTicket(req.params.displayId);
  res.json({ ticket });
});

export const getAttachment = asyncHandler(async (req: Request, res: Response) => {
  const attachment = await supportService.getAttachment(req.user!.sub, req.params.ticketId, req.params.filename);
  res.download(path.join(UPLOAD_DIRECTORY, attachment.path), attachment.filename);
});
