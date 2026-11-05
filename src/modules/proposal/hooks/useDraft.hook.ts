'use client';

import { useCallback, useMemo } from 'react';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { discardDraft, saveDraft } from '@/core/store/trip.actions';
import type { Block, DayNumber } from '@/modules/schedule/schedule.type';
import { blocksOfDay, sortBlocks } from '@/modules/schedule/utils/schedule.utils';
import { costDeltaPerPerson, diffSchedules } from '../utils/diff.utils';
import { currentVersionNumber } from '../utils/version.utils';

/** Bản nháp riêng của người đang dùng. Chưa sửa gì thì nháp = lịch chính thức. */
export function useDraft() {
  const state = useTripState();
  const me = state.currentMemberId;
  const n = state.members.length;
  const draft = state.drafts[me];
  const latest = currentVersionNumber(state.versions);

  const blocks = draft?.blocks ?? state.schedule;
  const baseVersion = draft?.baseVersion ?? latest;
  const base = useMemo(
    () => state.versions.find((v) => v.number === baseVersion)?.schedule ?? state.schedule,
    [state.versions, state.schedule, baseVersion],
  );

  const changes = useMemo(() => diffSchedules(base, blocks, n), [base, blocks, n]);
  const kindById = useMemo(() => new Map(changes.map((c) => [c.blockId, c.kind])), [changes]);

  const commit = useCallback((next: Block[]) => saveDraft(me, sortBlocks(next)), [me]);

  const updateBlock = useCallback((block: Block) => commit(blocks.map((b) => (b.id === block.id ? block : b))), [blocks, commit]);
  const addBlock = useCallback((block: Block) => commit([...blocks, block]), [blocks, commit]);
  const removeBlock = useCallback((id: string) => commit(blocks.filter((b) => b.id !== id)), [blocks, commit]);
  const restoreBlock = useCallback(
    (id: string) => {
      const original = base.find((b) => b.id === id);
      if (original) commit([...blocks.filter((b) => b.id !== id), original]);
    },
    [base, blocks, commit],
  );

  /** Kéo thả: các khung giờ giữ nguyên, khối đổi chỗ cho nhau */
  const reorderDay = useCallback(
    (day: DayNumber, orderedIds: string[]) => {
      const dayBlocks = blocksOfDay(blocks, day);
      const slots = dayBlocks.map((b) => b.time);
      const byId = new Map(dayBlocks.map((b) => [b.id, b]));
      const moved = orderedIds.map((id, i) => ({ ...(byId.get(id) as Block), time: slots[i] }));
      commit([...blocks.filter((b) => b.day !== day), ...moved]);
    },
    [blocks, commit],
  );

  return {
    memberCount: n,
    blocks,
    base,
    baseVersion,
    isOutdated: Boolean(draft) && baseVersion < latest,
    hasDraft: Boolean(draft),
    changes,
    kindById,
    costDelta: costDeltaPerPerson(base, blocks, n),
    dayBlocks: (day: DayNumber) => blocksOfDay(blocks, day),
    deletedOfDay: (day: DayNumber) => blocksOfDay(base, day).filter((b) => !blocks.some((x) => x.id === b.id)),
    dayHasChanges: (day: DayNumber) =>
      changes.some((c) => [...blocks, ...base].find((b) => b.id === c.blockId)?.day === day),
    updateBlock,
    addBlock,
    removeBlock,
    restoreBlock,
    reorderDay,
    discard: () => discardDraft(me),
  };
}
