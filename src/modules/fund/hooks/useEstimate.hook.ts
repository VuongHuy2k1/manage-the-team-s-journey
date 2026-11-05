'use client';

import { useMemo } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import {
  addExpense,
  addPlannedCost,
  deletePlannedCost,
  deleteBlock,
  editBlockCost,
  updatePlannedCost,
  type AddExpenseInput,
  type BlockCostInput,
  type PlannedCostInput,
} from '@/core/store/trip.actions';
import { useIsLeader } from '@/modules/member/hooks/useIsLeader.hook';
import type { Block, DayNumber } from '@/modules/schedule/schedule.type';
import { blocksOfDay, estimateGroup, estimatePerPerson } from '@/modules/schedule/utils/schedule.utils';
import { buildTripSummary } from '../utils/fund.utils';

export interface EstimateDay {
  day: DayNumber;
  blocks: Block[];
  total: number;
  perPerson: number;
}

const DAYS: DayNumber[] = [0, 1, 2, 3];

/** Bảng dự tính tổng hợp: lịch trình + khoản thêm ngoài lịch trình */
export function useEstimate() {
  const { schedule, completions, members, fund, currentMemberId } = useTripState();
  const isLeader = useIsLeader();
  const n = Math.max(1, members.length);
  const summary = useMemo(() => buildTripSummary(schedule, completions, members.length, fund), [schedule, completions, members.length, fund]);

  const days = useMemo<EstimateDay[]>(
    () =>
      DAYS.map((day) => {
        const blocks = blocksOfDay(schedule, day);
        return {
          day,
          blocks,
          total: blocks.reduce((s, b) => s + (estimateGroup(b, n) ?? 0), 0),
          perPerson: blocks.reduce((s, b) => s + (estimatePerPerson(b, n) ?? 0), 0),
        };
      }).filter((d) => d.blocks.length > 0),
    [schedule, n],
  );

  const planned = fund.planned ?? [];
  const expensesById = Object.fromEntries((fund.expenses ?? []).map((e) => [e.id, e]));

  return {
    summary,
    days,
    planned,
    plannedTotal: planned.reduce((s, p) => s + p.amount, 0),
    expensesById,
    completions,
    memberCount: n,
    members,
    meId: currentMemberId,
    fundBalance: fund.balance,
    isLeader,
    addPlanned: (input: PlannedCostInput) => addPlannedCost(input),
    updatePlanned: (id: string, input: PlannedCostInput) => updatePlannedCost(id, input),
    deletePlanned: (id: string) => deletePlannedCost(id),
    payPlanned: (input: AddExpenseInput) => addExpense(input),
    editBlock: (blockId: string, input: BlockCostInput) => editBlockCost(blockId, input),
    removeBlock: (blockId: string) => deleteBlock(blockId),
  };
}
