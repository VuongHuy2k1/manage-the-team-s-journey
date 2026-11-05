'use client';

import { useTripState } from '@/core/hooks/useTripState.hook';
import { addExpense, deleteExpense, type AddExpenseInput } from '@/core/store/trip.actions';
import { useIsLeader } from '@/modules/member/hooks/useIsLeader.hook';
import { indexMembers } from '@/modules/member/utils/role.utils';

/** Khoản chi ngoài lịch trình */
export function useExpenses() {
  const { fund, members, removedMembers, currentMemberId } = useTripState();
  const isLeader = useIsLeader();
  const expenses = fund.expenses ?? [];
  return {
    expenses,
    total: expenses.reduce((s, e) => s + e.amount, 0),
    membersById: indexMembers([...members, ...removedMembers]),
    members,
    memberCount: members.length,
    meId: currentMemberId,
    isLeader,
    fundBalance: fund.balance,
    add: (input: AddExpenseInput) => addExpense(input),
    remove: (id: string) => deleteExpense(id),
  };
}
