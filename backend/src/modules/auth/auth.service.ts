import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { authenticator } from 'otplib';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { recordSecurityLog } from '../../services/auditLog';
import type { DeviceMeta } from '../../utils/deviceMeta';
import { AppError } from '../../utils/errors';
import { generateMockHash, generateTransactionId, generateUserUuid } from '../../utils/ids';
import { signAccessToken, signMfaToken, signRefreshToken, verifyMfaToken, verifyRefreshToken } from '../../utils/jwt';
import { sanitizeUser } from '../../utils/serialize';
import type { ForgotInput, LoginInput, MfaInput, RegisterInput, ResetPasswordInput } from './auth.schemas';

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const BCRYPT_ROUNDS = 12;

const hashToken = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

async function createSession(userId: string, deviceMeta: DeviceMeta) {
  const existingDeviceCount = await prisma.device.count({ where: { userId } });
  const jti = crypto.randomUUID();

  const device = await prisma.device.create({
    data: {
      userId,
      displayId: `DEV-${String(existingDeviceCount + 1).padStart(2, '0')}`,
      name: deviceMeta.name,
      location: deviceMeta.location,
      ip: deviceMeta.ip,
      status: existingDeviceCount === 0 ? 'Primary' : 'Secondary',
      refreshTokenHash: hashToken(jti),
    },
  });

  const refreshToken = signRefreshToken({ sub: userId, deviceId: device.id, jti });
  return { device, refreshToken };
}

export async function registerUser(input: RegisterInput, deviceMeta: DeviceMeta) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw AppError.conflict('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      uuid: generateUserUuid(),
      email: input.email,
      name: input.name,
      passwordHash,
    },
  });

  await prisma.transaction.create({
    data: {
      displayId: generateTransactionId(),
      userId: user.id,
      action: 'DEPOSIT CASH POOL',
      flow: `+$${user.balanceUSD.toFixed(2)} USD`,
      hash: generateMockHash(),
      verification: 'SYSTEM-INIT',
    },
  });

  await recordSecurityLog(user.id, 'Account Registered', 'SUCCESS');

  const { refreshToken } = await createSession(user.id, deviceMeta);
  await recordSecurityLog(user.id, 'User session initialized', 'SUCCESS');

  const accessToken = signAccessToken({ sub: user.id, email: user.email });

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

export async function loginUser(input: LoginInput, deviceMeta: DeviceMeta) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    await recordSecurityLog(user.id, 'Credentials Verification Rejected', 'FAILURE');
    throw AppError.unauthorized('Invalid email or password');
  }

  await recordSecurityLog(user.id, 'Credentials Verified', 'SUCCESS');

  if (user.is2faEnabled) {
    const tempToken = signMfaToken({ sub: user.id, purpose: 'mfa-challenge' });
    return { requiresMfa: true as const, tempToken };
  }

  const { refreshToken } = await createSession(user.id, deviceMeta);
  await recordSecurityLog(user.id, 'User session initialized', 'SUCCESS');

  const accessToken = signAccessToken({ sub: user.id, email: user.email });

  return { requiresMfa: false as const, user: sanitizeUser(user), accessToken, refreshToken };
}

export async function verifyLoginMfa(input: MfaInput, deviceMeta: DeviceMeta) {
  let payload;
  try {
    payload = verifyMfaToken(input.tempToken);
  } catch {
    throw AppError.unauthorized('MFA challenge expired, please log in again');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.twoFactorSecret) {
    throw AppError.unauthorized('MFA challenge is no longer valid');
  }

  const valid = authenticator.check(input.code, user.twoFactorSecret);
  if (!valid) {
    await recordSecurityLog(user.id, 'MFA code validation rejection', 'FAILURE');
    throw AppError.unauthorized('Invalid 2FA code');
  }

  await recordSecurityLog(user.id, 'Double-Factor Standard Validated', 'SUCCESS');

  const { refreshToken } = await createSession(user.id, deviceMeta);
  await recordSecurityLog(user.id, 'User session initialized', 'SUCCESS');

  const accessToken = signAccessToken({ sub: user.id, email: user.email });

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

export async function refreshSession(token: string) {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw AppError.unauthorized('Invalid or expired session, please log in again');
  }

  const device = await prisma.device.findUnique({ where: { id: payload.deviceId } });
  if (!device || device.userId !== payload.sub || device.revokedAt) {
    throw AppError.unauthorized('Session has been revoked');
  }

  if (hashToken(payload.jti) !== device.refreshTokenHash) {
    throw AppError.unauthorized('Session token is no longer valid');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw AppError.unauthorized('Account no longer exists');
  }

  const newJti = crypto.randomUUID();
  await prisma.device.update({
    where: { id: device.id },
    data: { refreshTokenHash: hashToken(newJti), lastActiveAt: new Date() },
  });

  const refreshToken = signRefreshToken({ sub: user.id, deviceId: device.id, jti: newJti } as never);
  const accessToken = signAccessToken({ sub: user.id, email: user.email });

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

export async function logoutSession(token: string | undefined) {
  if (!token) return;
  try {
    const payload = verifyRefreshToken(token);
    await prisma.device.update({
      where: { id: payload.deviceId },
      data: { revokedAt: new Date() },
    });
    await recordSecurityLog(payload.sub, 'Manually requested session revocation', 'SUCCESS');
  } catch {
    // Token already invalid/expired - nothing to revoke.
  }
}

export async function requestPasswordReset(input: ForgotInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (user) {
    const token = `VRD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: hashToken(token),
        resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });
    await recordSecurityLog(user.id, 'Password reset requested', 'SUCCESS');

    // No transactional email provider is configured for this sandbox deployment;
    // the token is logged server-side so support staff can relay it to the user.
    logger.info({ email: user.email, token }, 'Password reset token issued (simulated email)');
  }

  return { message: 'If an account exists for that email, a reset code has been issued.' };
}

export async function resetPassword(input: ResetPasswordInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  const tokenValid =
    user?.resetTokenHash &&
    user.resetTokenExpiresAt &&
    user.resetTokenExpiresAt.getTime() > Date.now() &&
    user.resetTokenHash === hashToken(input.resetToken);

  if (!user || !tokenValid) {
    throw AppError.badRequest('Invalid or expired reset code');
  }

  const passwordHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
  });

  await recordSecurityLog(user.id, 'Password Reset Completed', 'SUCCESS');

  return { message: 'Password updated successfully' };
}
