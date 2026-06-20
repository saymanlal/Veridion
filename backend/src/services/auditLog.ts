import { prisma } from '../lib/prisma';

export async function recordSecurityLog(userId: string, action: string, status: 'SUCCESS' | 'FAILURE') {
  return prisma.securityLog.create({
    data: { userId, action, status },
  });
}
