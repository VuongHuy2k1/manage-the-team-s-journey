'use client';

import { useMemo } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { voteRequest } from '@/core/store/trip.actions';
import { indexMembers } from '@/modules/member/utils/role.utils';
import type { ScheduleRequest, VoteValue } from '../proposal.type';
import { findConflicts, type ConflictInfo } from '../utils/version.utils';

export interface RequestView {
  request: ScheduleRequest;
  up: number;
  down: number;
  notVoted: number;
  myVote: VoteValue | undefined;
  voters: { id: string; name: string; color: string }[];
  conflict: ConflictInfo;
}

export function useRequests() {
  const state = useTripState();
  const byId = useMemo(() => indexMembers(state.members), [state.members]);

  const pending = useMemo<RequestView[]>(
    () =>
      state.requests
        .filter((r) => r.status === 'pending')
        .map((request) => {
          const values = Object.entries(request.votes);
          const up = values.filter(([, v]) => v === 'up').length;
          const down = values.filter(([, v]) => v === 'down').length;
          return {
            request,
            up,
            down,
            notVoted: state.members.length - up - down,
            myVote: request.votes[state.currentMemberId],
            voters: values.filter(([, v]) => v === 'up').map(([id]) => byId[id]).filter(Boolean),
            conflict: findConflicts(request, state.versions, state.requests),
          };
        }),
    [state.requests, state.members, state.versions, state.currentMemberId, byId],
  );

  return {
    pending,
    historyCount: state.versions.length + state.requests.filter((r) => r.status === 'rejected').length,
    membersById: byId,
    vote: (requestId: string, value: VoteValue) => voteRequest(requestId, state.currentMemberId, value),
  };
}
