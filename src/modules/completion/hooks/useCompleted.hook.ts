'use client';

import { useMemo } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { useIsLeader } from '@/modules/member/hooks/useIsLeader.hook';
import { undoCompletion } from '@/core/store/trip.actions';
import type { Block, DayNumber } from '@/modules/schedule/schedule.type';
import { dayLabel, estimatePerPerson, sortBlocks } from '@/modules/schedule/utils/schedule.utils';
import type { Completion } from '../completion.type';
import { variance } from '../utils/variance.utils';

export interface CompletedRow {
  block: Block;
  completion: Completion;
  estimatePerPerson: number | null;
  actualPerPerson: number;
  diff: number | null;
}

export function useCompleted() {
  const state = useTripState();
  const isLeader = useIsLeader();
  const n = state.members.length;

  return useMemo(() => {
    const rows: CompletedRow[] = sortBlocks(state.schedule)
      .filter((b) => state.completions[b.id])
      .map((block) => {
        const completion = state.completions[block.id];
        const est = estimatePerPerson(block, n);
        const actual = Math.round(completion.actualTotal / n);
        return { block, completion, estimatePerPerson: est, actualPerPerson: actual, diff: variance(est, actual).diff };
      });

    const groups = ([0, 1, 2, 3] as DayNumber[])
      .map((day) => ({ day, label: dayLabel(day), rows: rows.filter((r) => r.block.day === day) }))
      .filter((g) => g.rows.length > 0);

    const estimate = rows.reduce((s, r) => s + (r.estimatePerPerson ?? 0), 0);
    const actual = rows.reduce((s, r) => s + r.actualPerPerson, 0);
    const remaining = state.schedule
      .filter((b) => !state.completions[b.id])
      .reduce((s, b) => s + (estimatePerPerson(b, n) ?? 0), 0);

    return {
      groups,
      count: rows.length,
      estimate,
      actual,
      diff: actual - estimate,
      remaining,
      fundBalance: state.fund.balance,
      pendingCount: state.pendingCompletions.length,
      memberCount: n,
      members: state.members,
      isLeader,
      undo: undoCompletion,
    };
  }, [state, n, isLeader]);
}
