'use client';

import { useMemo, useState } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { indexMembers } from '@/modules/member/utils/role.utils';
import type { LedgerEntry } from '../fund.type';

export type LedgerFilter = 'all' | 'in' | 'out';

/** Lịch sử cộng / trừ quỹ, nhóm theo ngày */
export function useLedger() {
  const { fund, members, removedMembers } = useTripState();
  const [filter, setFilter] = useState<LedgerFilter>('all');
  const entries = fund.ledger ?? [];

  const groups = useMemo(() => {
    const list = entries.filter((e) => (filter === 'in' ? e.amount > 0 : filter === 'out' ? e.amount < 0 : true));
    const map = new Map<string, LedgerEntry[]>();
    list.forEach((e) => {
      const day = new Date(e.at).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' });
      map.set(day, [...(map.get(day) ?? []), e]);
    });
    return Array.from(map, ([day, items]) => ({ day, items }));
  }, [entries, filter]);

  return {
    entries,
    groups,
    filter,
    setFilter,
    totalIn: entries.filter((e) => e.amount > 0).reduce((s, e) => s + e.amount, 0),
    totalOut: entries.filter((e) => e.amount < 0).reduce((s, e) => s - e.amount, 0),
    balance: fund.balance,
    membersById: indexMembers([...members, ...removedMembers]),
  };
}
