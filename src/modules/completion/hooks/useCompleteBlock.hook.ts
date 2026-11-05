'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { useIsLeader } from '@/modules/member/hooks/useIsLeader.hook';
import { confirmCompletion, requestCompletion } from '@/core/store/trip.actions';
import type { Block } from '@/modules/schedule/schedule.type';
import { estimateGroup, estimatePerPerson } from '@/modules/schedule/utils/schedule.utils';
import type { AmountUnit } from '@/modules/ui-core';
import type { PayMethod } from '../completion.type';
import { variance } from '../utils/variance.utils';

export function useCompleteBlock(block: Block | null) {
  const state = useTripState();
  const n = state.members.length;
  const isLeader = useIsLeader();

  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState<AmountUnit>('group');
  const [payMethod, setPayMethod] = useState<PayMethod>('fund');
  const [paidBy, setPaidBy] = useState(state.currentMemberId);

  // Mỗi lần mở cho một mốc mới: điền sẵn số dự tính cả nhóm
  useEffect(() => {
    if (!block) return;
    setAmount(estimateGroup(block, n) ?? 0);
    setUnit('group');
    setPayMethod('fund');
    setPaidBy(state.currentMemberId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block?.id]);

  const derived = useMemo(() => {
    const estPerPerson = block ? estimatePerPerson(block, n) : null;
    const estGroup = block ? estimateGroup(block, n) : null;
    const actualTotal = unit === 'group' ? amount : amount * n;
    const actualPerPerson = Math.round(actualTotal / n);
    const fromFund = payMethod === 'fund';
    return {
      estPerPerson,
      estGroup,
      actualTotal,
      actualPerPerson,
      variance: variance(estPerPerson, actualPerPerson),
      fundBefore: state.fund.balance,
      fundAfter: fromFund ? state.fund.balance - actualTotal : state.fund.balance,
      fromFund,
    };
  }, [block, n, unit, amount, payMethod, state.fund.balance]);

  const pending = block ? state.pendingCompletions.find((p) => p.blockId === block.id) : undefined;

  return {
    isLeader,
    memberCount: n,
    members: state.members,
    amount,
    setAmount,
    unit,
    setUnit,
    payMethod,
    setPayMethod,
    paidBy,
    setPaidBy,
    pending,
    ...derived,
    confirm: () => {
      if (!block || !isLeader) return Promise.resolve(false);
      return confirmCompletion(block.id, {
        actualTotal: derived.actualTotal,
        payMethod,
        paidBy: payMethod === 'advance' ? paidBy : undefined,
      });
    },
    request: () => block && requestCompletion(block.id, state.currentMemberId),
  };
}
