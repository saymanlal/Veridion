import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import * as controller from './security.controller';
import { disable2faSchema, enable2faSchema, lockTimeoutSchema, unlockSchema } from './security.schemas';

export const securityRouter = Router();

securityRouter.use(requireAuth);
securityRouter.get('/settings', controller.getSettings);
securityRouter.post('/2fa/setup', controller.beginTwoFactorSetup);
securityRouter.post('/2fa/enable', validateBody(enable2faSchema), controller.confirmTwoFactorSetup);
securityRouter.post('/2fa/disable', validateBody(disable2faSchema), controller.disableTwoFactor);
securityRouter.patch('/lock-timeout', validateBody(lockTimeoutSchema), controller.updateLockTimeout);
securityRouter.post('/unlock', validateBody(unlockSchema), controller.unlockTerminal);
securityRouter.get('/devices', controller.listDevices);
securityRouter.delete('/devices/:deviceId', controller.revokeDevice);
securityRouter.get('/audit-logs', controller.listAuditLogs);
