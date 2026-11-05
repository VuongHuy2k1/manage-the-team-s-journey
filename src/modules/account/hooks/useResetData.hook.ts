'use client';

import { useState } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { discardDraft, resetTripData, type ResetOptions } from '@/core/store/trip.actions';
import { useIsLeader } from '@/modules/member/hooks/useIsLeader.hook';
import { getRounds } from '@/modules/fund/utils/fund.utils';

/** Chữ phải gõ để xác nhận, tránh bấm nhầm */
export const RESET_CONFIRM_WORD = 'RESET';

export function useResetData() {
  const { versions, requests, completions, pendingCompletions, fund, currentMemberId } = useTripState();
  const isLeader = useIsLeader();
  const [options, setOptions] = useState<ResetOptions>({ history: true, ledger: true, spending: true, fund: true });
  const [confirmText, setConfirmText] = useState('');
  const [done, setDone] = useState(false);

  const paidTicks = getRounds(fund).reduce((s, r) => s + Object.values(r.payments).filter((p) => p.paid).length, 0);
  const counts = {
    history: `${versions.length} phiên bản · ${requests.length} yêu cầu`,
    ledger: `${(fund.ledger ?? []).length} dòng`,
    spending: `${Object.keys(completions).length + pendingCompletions.length} hoàn thành · ${(fund.expenses ?? []).length} khoản chi`,
    fund: `${paidTicks} lượt đã nộp · số dư hiện tại ${fund.balance.toLocaleString('vi-VN')}đ`,
  };

  const anySelected = Object.values(options).some(Boolean);
  const canSubmit = isLeader && anySelected && confirmText.trim().toUpperCase() === RESET_CONFIRM_WORD;

  return {
    isLeader,
    options,
    counts,
    toggle: (key: keyof ResetOptions, value: boolean) => setOptions((o) => ({ ...o, [key]: value })),
    confirmText,
    setConfirmText,
    canSubmit,
    done,
    submit: async () => {
      if (!canSubmit) return false;
      const ok = await resetTripData(options);
      if (ok) {
        if (options.history) await discardDraft(currentMemberId);
        setConfirmText('');
        setDone(true);
      }
      return ok;
    },
  };
}
