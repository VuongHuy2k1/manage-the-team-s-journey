import type { Block } from '@/modules/schedule/schedule.type';
import { sortBlocks } from '@/modules/schedule/utils/schedule.utils';
import type { Change, ScheduleRequest, Version } from '../proposal.type';
import { touchedBlockIds } from './diff.utils';

export function currentVersionNumber(versions: Version[]): number {
  return versions.reduce((max, v) => Math.max(max, v.number), 0);
}

/** Áp các thay đổi của một yêu cầu lên lịch hiện tại (kể cả khi lịch đã đổi sau lúc tạo nháp) */
export function applyChanges(current: Block[], changes: Change[], draft: Block[]): Block[] {
  const draftMap = new Map(draft.map((b) => [b.id, b]));
  let result = [...current];
  for (const change of changes) {
    if (change.kind === 'deleted') {
      result = result.filter((b) => b.id !== change.blockId);
      continue;
    }
    const next = draftMap.get(change.blockId);
    if (!next) continue;
    const index = result.findIndex((b) => b.id === change.blockId);
    if (index >= 0) result[index] = next;
    else result.push(next);
  }
  return sortBlocks(result);
}

/** Các khối đã bị đổi bởi phiên bản mới hơn phiên bản gốc của yêu cầu */
function changedSince(versions: Version[], baseVersion: number): Set<string> {
  const ids = new Set<string>();
  versions.filter((v) => v.number > baseVersion).forEach((v) => v.changes.forEach((c) => ids.add(c.blockId)));
  return ids;
}

export interface ConflictInfo {
  hasConflict: boolean;
  /** Tên các khối bị trùng */
  titles: string[];
}

export function findConflicts(request: ScheduleRequest, versions: Version[], requests: ScheduleRequest[]): ConflictInfo {
  const mine = touchedBlockIds(request.changes);
  const others = changedSince(versions, request.baseVersion);
  requests
    .filter((r) => r.id !== request.id && r.status === 'pending')
    .forEach((r) => r.changes.forEach((c) => others.add(c.blockId)));
  const titles = request.changes.filter((c) => mine.has(c.blockId) && others.has(c.blockId)).map((c) => c.title);
  return { hasConflict: titles.length > 0, titles };
}
