'use client';

import { useMemo, useState } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { currentVersionNumber } from '@/modules/proposal/utils/version.utils';
import type { DayNumber } from '../schedule.type';
import { TRIP_DAYS, blocksOfDay, sumPerPerson } from '../utils/schedule.utils';

export function useSchedule(initialDay: Exclude<DayNumber, 0> = 1) {
  const state = useTripState();
  const memberCount = state.members.length;
  const [day, setDay] = useState<Exclude<DayNumber, 0>>(initialDay);

  const dayBlocks = useMemo(() => blocksOfDay(state.schedule, day), [state.schedule, day]);
  const remaining = useMemo(() => dayBlocks.filter((b) => !state.completions[b.id]), [dayBlocks, state.completions]);
  const pendingIds = useMemo(() => new Set(state.pendingCompletions.map((p) => p.blockId)), [state.pendingCompletions]);

  const dayMeta = TRIP_DAYS.find((d) => d.value === day) ?? TRIP_DAYS[0];
  const pendingRequestCount = state.requests.filter((r) => r.status === 'pending').length;
  const hasDraft = Boolean(state.drafts[state.currentMemberId]);

  return {
    day,
    setDay,
    dayMeta,
    days: TRIP_DAYS,
    memberCount,
    remaining,
    doneCount: dayBlocks.length - remaining.length,
    pendingIds,
    pendingCompletionCount: state.pendingCompletions.length,
    dayEstimatePerPerson: sumPerPerson(dayBlocks, memberCount),
    tripEstimatePerPerson: sumPerPerson(state.schedule, memberCount),
    fundBalance: state.fund.balance,
    versionNumber: currentVersionNumber(state.versions),
    pendingRequestCount,
    hasDraft,
  };
}
