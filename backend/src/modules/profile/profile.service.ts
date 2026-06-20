import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { recordSecurityLog } from '../../services/auditLog';
import { AppError } from '../../utils/errors';
import { sanitizeUser } from '../../utils/serialize';
import type { UpdateNameInput, UpdatePasswordInput } from './profile.schemas';

const BCRYPT_ROUNDS = 12;

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound('User not found');
  return sanitizeUser(user);
}

export async function updateName(userId: string, input: UpdateNameInput) {
  const user = await prisma.user.update({ where: { id: userId }, data: { name: input.newName } });
  await recordSecurityLog(userId, 'Profile name updated', 'SUCCESS');
  return sanitizeUser(user);
}

export async function updatePassword(userId: string, input: UpdatePasswordInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound('User not found');

  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!valid) {
    await recordSecurityLog(userId, 'Password change rejected (bad current password)', 'FAILURE');
    throw AppError.badRequest('Current password is incorrect');
  }

  const passwordHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  await recordSecurityLog(userId, 'Password changed', 'SUCCESS');

  return { message: 'Password updated successfully' };
}
