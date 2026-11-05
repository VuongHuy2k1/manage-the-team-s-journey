'use client';

import { useMemo, useState } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { useIsLeader } from '@/modules/member/hooks/useIsLeader.hook';
import { restoreVersion } from '@/core/store/trip.actions';
import { indexMembers } from '@/modules/member/utils/role.utils';
import type { Change } from '../proposal.type';
import { currentVersionNumber } from '../utils/version.utils';

export type HistoryStatus = 'create' | 'approve' | 'restore' | 'edit' | 'reject';
export type HistoryFilter = 'all' | 'approved' | 'rejected' | 'mine';

export interface HistoryEntry {
  key: string;
  status: HistoryStatus;
  versionNumber?: number;
  at: string;
  title: string;
  proposedBy: string;
  decidedBy?: string;
  changes: Change[];
  note?: string;
  votesUp?: number;
}

export function useHistory() {
  const state = useTripState();
  const isLeader = useIsLeader();
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const byId = useMemo(() => indexMembers(state.members), [state.members]);
  const latest = currentVersionNumber(state.versions);

  const entries = useMemo<HistoryEntry[]>(() => {
    const requestsById = new Map(state.requests.map((r) => [r.id, r]));
    const fromVersions: HistoryEntry[] = state.versions.map((v) => {
      const req = v.requestId ? requestsById.get(v.requestId) : undefined;
      return {
        key: `v${v.number}`,
        status: v.type,
        versionNumber: v.number,
        at: v.at,
        title: v.title,
        proposedBy: v.proposedBy,
        decidedBy: v.decidedBy,
        changes: v.changes,
        note: req?.reason ? `Lý do: ${req.reason}` : undefined,
        votesUp: req ? Object.values(req.votes).filter((x) => x === 'up').length : undefined,
      };
    });
    const fromRejected: HistoryEntry[] = state.requests
      .filter((r) => r.status === 'rejected')
      .map((r) => ({
        key: r.id,
        status: 'reject',
        at: r.decidedAt ?? r.createdAt,
        title: r.title,
        proposedBy: r.authorId,
        decidedBy: r.decidedBy,
        changes: r.changes,
        note: r.rejectReason ? `Lý do từ chối: ${r.rejectReason}` : undefined,
      }));
    return [...fromVersions, ...fromRejected].sort((a, b) => b.at.localeCompare(a.at));
  }, [state.versions, state.requests]);

  const filtered = entries.filter((e) => {
    if (filter === 'approved') return e.status !== 'reject';
    if (filter === 'rejected') return e.status === 'reject';
    if (filter === 'mine') return e.proposedBy === state.currentMemberId;
    return true;
  });

  return {
    entries: filtered,
    total: entries.length,
    filter,
    setFilter,
    membersById: byId,
    memberCount: state.members.length,
    latestVersion: latest,
    isLeader,
    restore: restoreVersion,
  };
}
