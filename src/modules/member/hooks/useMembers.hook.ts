'use client';

import { useMemo } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { indexMembers } from '../utils/role.utils';

export function useMembers() {
  const { members, removedMembers, leaderIds } = useTripState();
  const byId = useMemo(() => indexMembers([...members, ...removedMembers]), [members, removedMembers]);
  const leaders = members.filter((m) => leaderIds.includes(m.id));
  return { members, removedMembers, byId, leaderIds, leaders, count: members.length };
}
