'use client';

import { useMemo } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { buildTripSummary } from '../utils/fund.utils';

export function useTripSummary() {
  const { schedule, completions, members, fund } = useTripState();
  return useMemo(() => buildTripSummary(schedule, completions, members.length, fund), [schedule, completions, members.length, fund]);
}
