'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/core/config/routes.config';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { submitRequest } from '@/core/store/trip.actions';
import { sumPerPerson } from '@/modules/schedule/utils/schedule.utils';
import { breakdownText, requestTitle } from '../utils/diff.utils';
import { useDraft } from './useDraft.hook';

/** So sánh bản nháp với lịch gốc và gửi thành yêu cầu cho nhóm trưởng */
export function useDiff() {
  const draft = useDraft();
  const { currentMemberId } = useTripState();
  const router = useRouter();

  const summary = useMemo(() => {
    const before = sumPerPerson(draft.base, draft.memberCount);
    const after = sumPerPerson(draft.blocks, draft.memberCount);
    return {
      title: requestTitle(draft.changes, draft.base, draft.blocks),
      breakdown: breakdownText(draft.changes),
      before,
      after,
    };
  }, [draft.base, draft.blocks, draft.changes, draft.memberCount]);

  const submit = async (reason: string) => {
    const id = await submitRequest(currentMemberId, {
      title: summary.title,
      reason,
      changes: draft.changes,
      costDeltaPerPerson: draft.costDelta,
    });
    if (id) router.push(ROUTES.requests);
  };

  return { ...draft, ...summary, submit };
}
