import { Prisma, type User } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { priceEngine } from '../../services/priceEngine';
import { recordSecurityLog } from '../../services/auditLog';
import { AppError } from '../../utils/errors';
import { generateMockHash, generateTransactionId, generateVerificationCode } from '../../utils/ids';
import { toBalances } from '../../utils/serialize';
import type { ReplenishInput, TradeInput } from './portfolio.schemas';

const ASSET_NAMES: Record<'BTC' | 'ETH' | 'VRD', string> = {
  BTC: 'Bitcoin (BTC)',
  ETH: 'Ethereum (ETH)',
  VRD: 'Veridion Coin (VRD)',
};

function getAssetBalance(user: User, asset: 'BTC' | 'ETH' | 'VRD') {
  if (asset === 'BTC') return user.balanceBTC;
  if (asset === 'ETH') return user.balanceETH;
  return user.balanceVRD;
}

function buildAssetUpdate(asset: 'BTC' | 'ETH' | 'VRD', value: Prisma.Decimal): Prisma.UserUpdateInput {
  if (asset === 'BTC') return { balanceBTC: value };
  if (asset === 'ETH') return { balanceETH: value };
  return { balanceVRD: value };
}

function computeValuation(balances: ReturnType<typeof toBalances>, prices: ReturnType<typeof priceEngine.getSnapshot>) {
  return (
    balances.USD +
    balances.BTC * prices.BTC +
    balances.ETH * prices.ETH +
    balances.VRD * prices.VRD
  );
}

export async function getPortfolio(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound('User not found');

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 100,
  });

  const balances = toBalances(user);
  const prices = priceEngine.getSnapshot();

  return {
    balances,
    prices,
    totalValuation: Math.round(computeValuation(balances, prices) * 100) / 100,
    transactions: transactions.map((tx) => ({
      id: tx.displayId,
      date: tx.date.toISOString().replace('T', ' ').slice(0, 19),
      action: tx.action,
      flow: tx.flow,
      hash: tx.hash,
      verification: tx.verification,
    })),
  };
}

export function getPrices() {
  return priceEngine.getSnapshot();
}

export async function executeTrade(userId: string, input: TradeInput) {
  const prices = priceEngine.getSnapshot();
  const price = prices[input.asset];
  const settlementCost = new Prisma.Decimal(price).mul(input.volume);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw AppError.notFound('User not found');

    const volumeDecimal = new Prisma.Decimal(input.volume);
    const assetBalance = getAssetBalance(user, input.asset);

    if (input.action === 'BUY') {
      if (user.balanceUSD.lt(settlementCost)) {
        throw AppError.badRequest('Insufficient USD balance for this trade');
      }
      await tx.user.update({
        where: { id: userId },
        data: {
          balanceUSD: user.balanceUSD.sub(settlementCost),
          ...buildAssetUpdate(input.asset, assetBalance.add(volumeDecimal)),
        },
      });
    } else {
      if (assetBalance.lt(volumeDecimal)) {
        throw AppError.badRequest(`Insufficient ${input.asset} balance for this trade`);
      }
      await tx.user.update({
        where: { id: userId },
        data: {
          balanceUSD: user.balanceUSD.add(settlementCost),
          ...buildAssetUpdate(input.asset, assetBalance.sub(volumeDecimal)),
        },
      });
    }

    const sign = input.action === 'BUY' ? '+' : '-';
    const usdSign = input.action === 'BUY' ? '-' : '+';
    const flow = `${sign}${input.volume} ${input.asset} / ${usdSign}$${settlementCost.toFixed(2)} USD`;

    const transaction = await tx.transaction.create({
      data: {
        displayId: generateTransactionId(),
        userId,
        action: `${input.action} ${ASSET_NAMES[input.asset]}`,
        asset: input.asset,
        flow,
        hash: generateMockHash(),
        verification: generateVerificationCode(),
      },
    });

    const updatedUser = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    return { transaction, balances: toBalances(updatedUser) };
  });

  await recordSecurityLog(
    userId,
    `Exchange Executed: ${input.action === 'BUY' ? 'Buy' : 'Sell'} ${input.volume} ${input.asset}`,
    'SUCCESS',
  );

  return {
    balances: result.balances,
    transaction: {
      id: result.transaction.displayId,
      date: result.transaction.date.toISOString().replace('T', ' ').slice(0, 19),
      action: result.transaction.action,
      flow: result.transaction.flow,
      hash: result.transaction.hash,
      verification: result.transaction.verification,
    },
  };
}

export async function replenishCash(userId: string, input: ReplenishInput) {
  const amount = input.amount ?? 10_000;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { balanceUSD: { increment: amount } },
  });

  await prisma.transaction.create({
    data: {
      displayId: generateTransactionId(),
      userId,
      action: 'DEPOSIT CASH POOL',
      flow: `+$${amount.toFixed(2)} USD`,
      hash: generateMockHash(),
      verification: 'SYSTEM-INIT',
    },
  });

  await recordSecurityLog(userId, `Sandbox cash pool replenished (+$${amount.toFixed(2)})`, 'SUCCESS');

  return { balances: toBalances(user), message: 'Cash pool replenished' };
}
