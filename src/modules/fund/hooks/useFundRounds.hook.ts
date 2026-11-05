'use client';

import { useMemo, useState } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { createFundRound, deleteFundRound, setRoundPaid, type CreateRoundInput } from '@/core/store/trip.actions';
import { useIsLeader } from '@/modules/member/hooks/useIsLeader.hook';
import type { Member } from '@/modules/member/member.type';
import type { FundRound } from '../fund.type';
import { buildTripSummary, getRounds, suggestTopUp } from '../utils/fund.utils';

export interface RoundView {
  round: FundRound;
  index: number;
  rows: { member: Member; paid: boolean; amount: number; at?: string }[];
  paidCount: number;
  collected: number;
  expected: number;
  canDelete: boolean;
}

/** Các lần thu quỹ và danh sách đã nộp của từng lần */
export function useFundRounds() {
  const state = useTripState();
  const isLeader = useIsLeader();
  const [openId, setOpenId] = useState<string | null>(null);

  const rounds = useMemo<RoundView[]>(() => {
    const all = getRounds(state.fund);
    return all.map((round, index) => {
      const rows = state.members.map((member) => {
        const p = round.payments[member.id];
        return { member, paid: Boolean(p?.paid), amount: p?.paid ? p.amount : round.amount, at: p?.at };
      });
      const paidRows = rows.filter((r) => r.paid);
      return {
        round,
        index,
        rows,
        paidCount: paidRows.length,
        collected: paidRows.reduce((s, r) => s + r.amount, 0),
        expected: round.amount * state.members.length,
        canDelete: all.length > 1 && !Object.values(round.payments).some((p) => p.paid),
      };
    });
  }, [state.fund, state.members]);

  const summary = useMemo(
    () => buildTripSummary(state.schedule, state.completions, state.members.length, state.fund),
    [state.schedule, state.completions, state.members.length, state.fund],
  );
  const latest = rounds[rounds.length - 1];

  return {
    rounds,
    latest,
    isLeader,
    totalCollected: rounds.reduce((s, r) => s + r.collected, 0),
    /** Lần đang mở danh sách; mặc định mở lần mới nhất */
    openId: openId ?? latest?.round.id ?? null,
    toggleOpen: (id: string) => setOpenId((cur) => ((cur ?? latest?.round.id) === id ? '' : id)),
    toggle: (roundId: string, memberId: string, paid: boolean) => setRoundPaid(roundId, memberId, paid),
    create: async (input: CreateRoundInput) => {
      const ok = await createFundRound(input);
      if (ok) setOpenId(null);
      return ok;
    },
    remove: (roundId: string) => deleteFundRound(roundId),
    /** Gợi ý cho lần nộp mới */
    suggestion: {
      title: `Nộp bổ sung lần ${rounds.length + 1}`,
      amount: suggestTopUp(summary.leftover, summary.memberCount) || latest?.round.amount || 0,
      shortage: summary.leftover < 0 ? -summary.leftover : 0,
    },
  };
}
