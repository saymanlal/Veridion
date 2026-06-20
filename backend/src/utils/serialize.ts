import type { User } from '@prisma/client';

export function sanitizeUser(user: User) {
  return {
    uuid: user.uuid,
    email: user.email,
    name: user.name,
    createdDate: user.createdAt.toISOString().slice(0, 10),
    is2faEnabled: user.is2faEnabled,
    lockTimeoutSeconds: user.lockTimeoutSeconds,
  };
}

export function toBalances(user: User) {
  return {
    USD: user.balanceUSD.toNumber(),
    BTC: user.balanceBTC.toNumber(),
    ETH: user.balanceETH.toNumber(),
    VRD: user.balanceVRD.toNumber(),
  };
}
