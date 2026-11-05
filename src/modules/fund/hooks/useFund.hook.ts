'use client';

import { useTripState } from '@/core/hooks/useTripState.hook';
import { useIsLeader } from '@/modules/member/hooks/useIsLeader.hook';
import { setFundBalance, setMomo } from '@/core/store/trip.actions';
import { indexMembers, memberName } from '@/modules/member/utils/role.utils';
import { formatWhen } from '@/core/utils/time.utils';
import { readImageAsDataUrl } from '@/core/utils/image.utils';
import { DEFAULT_MOMO_FUND_LINK } from '@/core/data/seed.data';
import { getRounds } from '../utils/fund.utils';

export function useFund() {
  const state = useTripState();
  const isLeader = useIsLeader();
  const { fund } = state;
  const byId = indexMembers(state.members);

  const rounds = getRounds(fund);
  const latestRound = rounds[rounds.length - 1];

  return {
    fund,
    latestRound,
    fundLink: fund.momo.fundLink ?? DEFAULT_MOMO_FUND_LINK,
    isLeader,
    updatedText: fund.balanceUpdatedAt
      ? `${memberName(byId, fund.balanceUpdatedBy)} cập nhật ${formatWhen(fund.balanceUpdatedAt).toLowerCase()}`
      : 'Chưa cập nhật',
    setBalance: (amount: number, reason?: string) => setFundBalance(amount, reason),
    setMomo,
    uploadQr: async (file: File) => setMomo({ qrDataUrl: await readImageAsDataUrl(file) }),
  };
}
