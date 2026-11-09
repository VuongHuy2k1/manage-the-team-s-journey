'use client';

import { useMemo } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import type { Block, DayNumber } from '@/modules/schedule/schedule.type';
import { blocksOfDay, sumPerPerson } from '@/modules/schedule/utils/schedule.utils';
import type { ChangeKind, ScheduleRequest } from '../proposal.type';
import { applyChanges } from '../utils/version.utils';

export interface PreviewDay {
  day: DayNumber;
  /** Lịch sau khi duyệt */
  after: Block[];
  /** Lịch hiện tại */
  before: Block[];
  /** Mục bị bỏ trong ngày này */
  removed: Block[];
  changed: boolean;
}

const DAYS: DayNumber[] = [0, 1, 2, 3];

/** Lịch trình sẽ ra sao nếu nhóm trưởng duyệt yêu cầu này */
export function useRequestPreview(request: ScheduleRequest | null) {
  const { schedule, members } = useTripState();
  const n = Math.max(1, members.length);

  return useMemo(() => {
    if (!request) return null;
    const after = applyChanges(schedule, request.changes, request.draft);
    const kindById = new Map<string, ChangeKind>(request.changes.map((c) => [c.blockId, c.kind]));
    const afterIds = new Set(after.map((b) => b.id));
    const days: PreviewDay[] = DAYS.map((day) => {
      const beforeBlocks = blocksOfDay(schedule, day);
      const afterBlocks = blocksOfDay(after, day);
      const removed = beforeBlocks.filter((b) => !afterIds.has(b.id));
      return {
        day,
        before: beforeBlocks,
        after: afterBlocks,
        removed,
        changed: removed.length > 0 || afterBlocks.some((b) => kindById.has(b.id)) || beforeBlocks.some((b) => kindById.has(b.id)),
      };
    }).filter((d) => d.before.length > 0 || d.after.length > 0);

    return {
      days,
      kindById,
      memberCount: n,
      perPersonBefore: sumPerPerson(schedule, n),
      perPersonAfter: sumPerPerson(after, n),
    };
  }, [request, schedule, n]);
}
