'use client';

import { TRIP } from '@/core/config/trip.config';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { updateTripInfo } from '@/core/store/trip.actions';
import { useIsLeader } from '@/modules/member/hooks/useIsLeader.hook';

/** Tên chuyến, dòng mô tả và quyền sửa (chỉ nhóm trưởng) */
export function useTripInfo() {
  const { info, members } = useTripState();
  const isLeader = useIsLeader();
  return {
    name: info?.name || TRIP.name,
    subtitle: info?.subtitle ?? TRIP.route,
    memberCount: members.length,
    canEdit: isLeader,
    save: (next: { name: string; subtitle: string }) => updateTripInfo(next),
  };
}
