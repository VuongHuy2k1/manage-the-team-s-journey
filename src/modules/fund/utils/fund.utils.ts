import type { Completion } from '@/modules/completion/completion.type';
import type { Block } from '@/modules/schedule/schedule.type';
import { estimateGroup, estimatePerPerson } from '@/modules/schedule/utils/schedule.utils';
import type { Fund, FundRound, TripSummary } from '../fund.type';

/** Các lần thu quỹ; dữ liệu cũ (target + contributions) được xem là "Lần 1" */
export function getRounds(fund: Fund): FundRound[] {
  if (fund.rounds && fund.rounds.length > 0) return fund.rounds;
  return [
    {
      id: 'r1',
      title: 'Lần 1',
      amount: fund.target,
      createdAt: '',
      payments: Object.fromEntries(
        Object.entries(fund.contributions ?? {}).map(([id, c]) => [id, { paid: c.paid, amount: c.amount, at: c.at }]),
      ),
    },
  ];
}

export function contributedTotal(fund: Fund): number {
  return getRounds(fund).reduce(
    (sum, r) => sum + Object.values(r.payments).reduce((s, p) => s + (p.paid ? p.amount : 0), 0),
    0,
  );
}

/** Gợi ý mức nộp bổ sung mỗi người để đủ chi phí còn lại (làm tròn lên 10.000đ) */
export function suggestTopUp(leftover: number, memberCount: number): number {
  if (leftover >= 0 || memberCount <= 0) return 0;
  return Math.ceil(-leftover / memberCount / 10000) * 10000;
}

/** Tổng hợp chi phí cả chuyến: dự tính, đã chi, còn chi, tiền thừa, chia đầu người */
export function buildTripSummary(
  schedule: Block[],
  completions: Record<string, Completion>,
  memberCount: number,
  fund: Fund,
): TripSummary {
  const n = Math.max(1, memberCount);
  const done = schedule.filter((b) => completions[b.id]);
  const notDone = schedule.filter((b) => !completions[b.id]);

  const planned = fund.planned ?? [];
  const plannedOpen = planned.filter((p) => !p.expenseId);
  const plannedEstimate = planned.reduce((s, p) => s + p.amount, 0);
  const plannedRemaining = plannedOpen.reduce((s, p) => s + p.amount, 0);
  const totalEstimate = schedule.reduce((s, b) => s + (estimateGroup(b, n) ?? 0), 0) + plannedEstimate;
  const expenses = fund.expenses ?? [];
  const spentActual = done.reduce((s, b) => s + completions[b.id].actualTotal, 0) + expenses.reduce((s, e) => s + e.amount, 0);
  const remainingEstimate = notDone.reduce((s, b) => s + (estimateGroup(b, n) ?? 0), 0) + plannedRemaining;
  const contributed = contributedTotal(fund);
  const leftover = fund.balance - remainingEstimate;

  return {
    memberCount: n,
    totalEstimate,
    plannedEstimate,
    spentActual,
    spentCount: done.length + expenses.length,
    remainingEstimate,
    remainingCount: notDone.length + plannedOpen.length,
    contributed,
    balance: fund.balance,
    leftover,
    perPerson: {
      estimate: schedule.reduce((s, b) => s + (estimatePerPerson(b, n) ?? 0), 0) + Math.round(plannedEstimate / n),
      spent: Math.round(spentActual / n),
      remaining: notDone.reduce((s, b) => s + (estimatePerPerson(b, n) ?? 0), 0) + Math.round(plannedRemaining / n),
      leftover: Math.round(leftover / n),
    },
  };
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export const LEDGER_LIMIT = 300;
