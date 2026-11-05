'use client';

import { useState } from 'react';
import { setMemberRemoved } from '@/core/api/account.api';
import { tripStore } from '@/core/store/trip.store';
import type { Member } from '../member.type';
import { useCurrentMember } from './useCurrentMember.hook';
import { useMembers } from './useMembers.hook';

/** Nhóm trưởng xem và xoá / khôi phục thành viên */
export function useMemberManagement() {
  const { members, removedMembers, leaderIds, byId } = useMembers();
  const { member: me, isLeader } = useCurrentMember();
  const [confirming, setConfirming] = useState<Member | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = async (id: string, removed: boolean) => {
    setBusyId(id);
    try {
      await setMemberRemoved(id, removed);
    } catch {
      tripStore.reportError(removed ? 'Không xoá được thành viên.' : 'Không khôi phục được thành viên.');
    } finally {
      setBusyId(null);
    }
  };

  return {
    members,
    removedMembers,
    leaderIds,
    byId,
    meId: me.id,
    isLeader,
    busyId,
    confirming,
    askRemove: (m: Member) => setConfirming(m),
    cancel: () => setConfirming(null),
    confirmRemove: async () => {
      if (!confirming) return;
      const id = confirming.id;
      await run(id, true);
      setConfirming(null);
    },
    restore: (id: string) => run(id, false),
  };
}
