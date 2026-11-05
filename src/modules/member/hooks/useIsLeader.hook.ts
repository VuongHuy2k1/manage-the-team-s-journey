'use client';

import { useTripState } from '@/core/hooks/useTripState.hook';

/** Nhóm trưởng = đã nhập đúng mã nhóm trưởng (Firestore rules xác nhận) */
export function useIsLeader(): boolean {
  const { leaderIds, currentMemberId } = useTripState();
  return leaderIds.includes(currentMemberId);
}
