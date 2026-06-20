import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { auditLogQuerySchema } from './security.schemas';
import * as securityService from './security.service';

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  res.json(await securityService.getSettings(req.user!.sub));
});

export const beginTwoFactorSetup = asyncHandler(async (req: Request, res: Response) => {
  res.json(await securityService.beginTwoFactorSetup(req.user!.sub));
});

export const confirmTwoFactorSetup = asyncHandler(async (req: Request, res: Response) => {
  res.json(await securityService.confirmTwoFactorSetup(req.user!.sub, req.body));
});

export const disableTwoFactor = asyncHandler(async (req: Request, res: Response) => {
  res.json(await securityService.disableTwoFactor(req.user!.sub, req.body));
});

export const updateLockTimeout = asyncHandler(async (req: Request, res: Response) => {
  res.json(await securityService.updateLockTimeout(req.user!.sub, req.body));
});

export const unlockTerminal = asyncHandler(async (req: Request, res: Response) => {
  res.json(await securityService.unlockTerminal(req.user!.sub, req.body));
});

export const listDevices = asyncHandler(async (req: Request, res: Response) => {
  res.json({ activeDevices: await securityService.listDevices(req.user!.sub) });
});

export const revokeDevice = asyncHandler(async (req: Request, res: Response) => {
  const activeDevices = await securityService.revokeDevice(req.user!.sub, req.params.deviceId);
  res.json({ activeDevices, message: 'Device session revoked' });
});

export const listAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const { page, pageSize } = auditLogQuerySchema.parse(req.query);
  res.json(await securityService.listAuditLogs(req.user!.sub, page, pageSize));
});
