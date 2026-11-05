'use client';

import { approveRequest, rejectRequest } from '@/core/store/trip.actions';
import { useIsLeader } from '@/modules/member/hooks/useIsLeader.hook';

export function useApprove() {
  const isLeader = useIsLeader();
  return {
    isLeader,
    approve: (requestId: string) => isLeader && approveRequest(requestId),
    reject: (requestId: string, reason: string) => isLeader && rejectRequest(requestId, reason),
  };
}
