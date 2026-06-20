import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { prisma } from '../../lib/prisma';
import { recordSecurityLog } from '../../services/auditLog';
import { AppError } from '../../utils/errors';
import type { Disable2faInput, Enable2faInput, LockTimeoutInput, UnlockInput } from './security.schemas';

const ISSUER = 'Veridion';

export async function getSettings(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound('User not found');
  return {
    is2faEnabled: user.is2faEnabled,
    lockTimeoutSeconds: user.lockTimeoutSeconds,
  };
}

export async function beginTwoFactorSetup(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound('User not found');

  const secret = authenticator.generateSecret();
  await prisma.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } });

  const otpauthUrl = authenticator.keyuri(user.email, ISSUER, secret);
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

  return { secret, qrCodeDataUrl };
}

export async function confirmTwoFactorSetup(userId: string, input: Enable2faInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.twoFactorSecret) {
    throw AppError.badRequest('2FA setup has not been initiated');
  }

  const valid = authenticator.check(input.code, user.twoFactorSecret);
  if (!valid) {
    await recordSecurityLog(userId, '2FA enablement rejected (bad code)', 'FAILURE');
    throw AppError.badRequest('Invalid 2FA code');
  }

  await prisma.user.update({ where: { id: userId }, data: { is2faEnabled: true } });
  await recordSecurityLog(userId, 'Two-factor authentication enabled', 'SUCCESS');

  return { is2faEnabled: true };
}

export async function disableTwoFactor(userId: string, input: Disable2faInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound('User not found');

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    await recordSecurityLog(userId, '2FA disablement rejected (bad password)', 'FAILURE');
    throw AppError.badRequest('Incorrect password');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { is2faEnabled: false, twoFactorSecret: null },
  });
  await recordSecurityLog(userId, 'Two-factor authentication disabled', 'SUCCESS');

  return { is2faEnabled: false };
}

export async function updateLockTimeout(userId: string, input: LockTimeoutInput) {
  await prisma.user.update({
    where: { id: userId },
    data: { lockTimeoutSeconds: input.lockTimeoutSeconds },
  });
  await recordSecurityLog(userId, `Inactivity lock timeout set to ${input.lockTimeoutSeconds}s`, 'SUCCESS');
  return { lockTimeoutSeconds: input.lockTimeoutSeconds };
}

export async function unlockTerminal(userId: string, input: UnlockInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound('User not found');

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    await recordSecurityLog(userId, 'Terminal unlock rejected (bad password)', 'FAILURE');
    throw AppError.badRequest('Incorrect password');
  }

  await recordSecurityLog(userId, 'Unlock inactive terminal environment', 'SUCCESS');
  return { unlocked: true };
}

function serializeDevice(device: { displayId: string; name: string; location: string; ip: string; status: string; lastActiveAt: Date; revokedAt: Date | null }) {
  return {
    id: device.displayId,
    name: device.name,
    location: device.location,
    ip: device.ip,
    status: device.status,
    timestamp: device.revokedAt
      ? 'Revoked'
      : Date.now() - device.lastActiveAt.getTime() < 60_000
        ? 'Active Now'
        : `Synchronized: ${Math.round((Date.now() - device.lastActiveAt.getTime()) / 60_000)}m ago`,
  };
}

export async function listDevices(userId: string) {
  const devices = await prisma.device.findMany({
    where: { userId, revokedAt: null },
    orderBy: { lastActiveAt: 'desc' },
  });
  return devices.map(serializeDevice);
}

export async function revokeDevice(userId: string, displayId: string) {
  const device = await prisma.device.findFirst({ where: { userId, displayId, revokedAt: null } });
  if (!device) throw AppError.notFound('Device not found');

  await prisma.device.update({ where: { id: device.id }, data: { revokedAt: new Date() } });
  await recordSecurityLog(userId, `Manually revoked session on ${device.name}`, 'SUCCESS');

  return listDevices(userId);
}

export async function listAuditLogs(userId: string, page: number, pageSize: number) {
  const [logs, total] = await Promise.all([
    prisma.securityLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.securityLog.count({ where: { userId } }),
  ]);

  return {
    total,
    page,
    pageSize,
    securityLogs: logs.map((log) => ({
      date: log.date.toISOString().replace('T', ' ').slice(0, 19),
      action: log.action,
      status: log.status,
    })),
  };
}
