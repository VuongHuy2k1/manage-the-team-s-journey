'use client';

import { useMemo } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import type { Completion } from '@/modules/completion/completion.type';
import { indexMembers } from '@/modules/member/utils/role.utils';
import type { Member } from '@/modules/member/member.type';
import type { Block, DayNumber } from '@/modules/schedule/schedule.type';
import { blocksOfDay, estimateGroup } from '@/modules/schedule/utils/schedule.utils';
import type { ExtraExpense } from '../fund.type';

export type PayKind = 'fund' | 'advance' | 'self';

export interface ActualDayRow {
  block: Block;
  completion: Completion;
  /** Dự tính cả nhóm, null = chưa có giá */
  estimate: number | null;
}

export interface ActualDay {
  day: DayNumber;
  rows: ActualDayRow[];
  total: number;
  estimate: number;
}

export interface ActualExpenseRow {
  expense: ExtraExpense;
  /** Dự tính của khoản thêm tương ứng (nếu chi cho khoản dự tính) */
  estimate: number | null;
}

export interface Payer {
  member: Member | undefined;
  memberId: string;
  total: number;
  count: number;
}

const DAYS: DayNumber[] = [0, 1, 2, 3];

/** Tổng kết chi phí thực tế: theo ngày, ngoài lịch trình, theo cách trả, ai ứng trước */
export function useActual() {
  const { schedule, completions, members, removedMembers, fund } = useTripState();
  const n = Math.max(1, members.length);

  return useMemo(() => {
    const byId = indexMembers([...members, ...removedMembers]);
    const plannedById = Object.fromEntries((fund.planned ?? []).map((p) => [p.id, p]));

    const days: ActualDay[] = DAYS.map((day) => {
      const rows = blocksOfDay(schedule, day)
        .filter((b) => completions[b.id])
        .map((block) => ({ block, completion: completions[block.id], estimate: estimateGroup(block, n) }));
      return {
        day,
        rows,
        total: rows.reduce((s, r) => s + r.completion.actualTotal, 0),
        estimate: rows.reduce((s, r) => s + (r.estimate ?? 0), 0),
      };
    }).filter((d) => d.rows.length > 0);

    const expenses: ActualExpenseRow[] = [...(fund.expenses ?? [])]
      .sort((a, b) => a.at.localeCompare(b.at))
      .map((expense) => ({ expense, estimate: expense.plannedId ? plannedById[expense.plannedId]?.amount ?? null : null }));

    const scheduleTotal = days.reduce((s, d) => s + d.total, 0);
    const extraTotal = expenses.reduce((s, e) => s + e.expense.amount, 0);
    const total = scheduleTotal + extraTotal;
    /** Dự tính của những thứ đã chi (để so sánh) */
    const comparedEstimate =
      days.reduce((s, d) => s + d.estimate, 0) + expenses.reduce((s, e) => s + (e.estimate ?? 0), 0);
    const comparedActual =
      scheduleTotal + expenses.reduce((s, e) => s + (e.estimate !== null ? e.expense.amount : 0), 0);

    const byMethod: Record<PayKind, number> = { fund: 0, advance: 0, self: 0 };
    const payers: Record<string, Payer> = {};
    const add = (method: PayKind, amount: number, paidBy?: string) => {
      byMethod[method] += amount;
      if (method === 'advance' && paidBy) {
        const p = (payers[paidBy] ??= { member: byId[paidBy], memberId: paidBy, total: 0, count: 0 });
        p.total += amount;
        p.count += 1;
      }
    };
    days.forEach((d) => d.rows.forEach((r) => add(r.completion.payMethod, r.completion.actualTotal, r.completion.paidBy)));
    expenses.forEach((e) => add(e.expense.payMethod, e.expense.amount, e.expense.paidBy));

    return {
      memberCount: n,
      membersById: byId,
      days,
      expenses,
      total,
      perPerson: Math.round(total / n),
      scheduleTotal,
      extraTotal,
      count: days.reduce((s, d) => s + d.rows.length, 0) + expenses.length,
      comparedEstimate,
      comparedDiff: comparedActual - comparedEstimate,
      byMethod,
      payers: Object.values(payers).sort((a, b) => b.total - a.total),
      fundBalance: fund.balance,
    };
  }, [schedule, completions, members, removedMembers, fund, n]);
}
