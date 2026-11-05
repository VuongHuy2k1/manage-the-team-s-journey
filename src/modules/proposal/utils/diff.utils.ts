import { formatSignedK } from '@/modules/ui-core/utils/money.utils';
import type { Block } from '@/modules/schedule/schedule.type';
import {
  CATEGORY_LABEL,
  costText,
  dayLabel,
  positionText,
  sortBlocks,
  sumPerPerson,
} from '@/modules/schedule/utils/schedule.utils';
import type { Change, ChangeKind } from '../proposal.type';

export const CHANGE_LABEL: Record<ChangeKind, string> = {
  moved: 'Dời',
  edited: 'Sửa',
  added: 'Thêm',
  deleted: 'Xoá',
};

interface FieldDiff {
  before: string;
  after: string;
}

function fieldDiffs(base: Block, next: Block, memberCount: number): FieldDiff[] {
  const diffs: FieldDiff[] = [];
  if (base.title !== next.title) diffs.push({ before: base.title, after: next.title });
  if (base.category !== next.category) {
    diffs.push({ before: CATEGORY_LABEL[base.category], after: CATEGORY_LABEL[next.category] });
  }
  if (base.address !== next.address) {
    diffs.push({ before: base.address || 'Chưa có địa chỉ', after: next.address || 'Chưa có địa chỉ' });
  }
  const baseCost = costText(base, memberCount);
  const nextCost = costText(next, memberCount);
  if (baseCost !== nextCost) diffs.push({ before: baseCost, after: nextCost });
  if (base.lat !== next.lat || base.lng !== next.lng) {
    diffs.push({ before: base.lat !== undefined ? 'Vị trí cũ trên bản đồ' : 'Chưa ghim bản đồ', after: next.lat !== undefined ? 'Ghim vị trí mới' : 'Bỏ ghim bản đồ' });
  }
  if ((base.note ?? '') !== (next.note ?? '')) {
    diffs.push({ before: base.note || 'Không ghi chú', after: next.note || 'Không ghi chú' });
  }
  return diffs;
}

function positionDiff(base: Block, next: Block): FieldDiff | null {
  if (base.day === next.day && base.time === next.time) return null;
  if (base.day === next.day) return { before: `Giờ ${base.time}`, after: `Giờ ${next.time}` };
  return { before: positionText(base), after: positionText(next) };
}

/** So bản nháp với lịch gốc, trả về danh sách thay đổi theo thứ tự lịch */
export function diffSchedules(base: Block[], draft: Block[], memberCount: number): Change[] {
  const baseMap = new Map(base.map((b) => [b.id, b]));
  const draftIds = new Set(draft.map((b) => b.id));
  const changes: Change[] = [];

  for (const next of sortBlocks(draft)) {
    const prev = baseMap.get(next.id);
    if (!prev) {
      changes.push({ kind: 'added', blockId: next.id, title: next.title, before: 'Chưa có', after: positionText(next) });
      continue;
    }
    const pos = positionDiff(prev, next);
    const fields = fieldDiffs(prev, next, memberCount);
    if (!pos && fields.length === 0) continue;
    const all = pos ? [pos, ...fields] : fields;
    changes.push({
      kind: fields.length === 0 ? 'moved' : 'edited',
      blockId: next.id,
      title: next.title,
      before: all.map((d) => d.before).join(' · '),
      after: all.map((d) => d.after).join(' · '),
    });
  }

  for (const prev of sortBlocks(base)) {
    if (!draftIds.has(prev.id)) {
      changes.push({ kind: 'deleted', blockId: prev.id, title: prev.title, before: positionText(prev), after: 'Bỏ khỏi lịch' });
    }
  }
  return changes;
}

export function costDeltaPerPerson(base: Block[], draft: Block[], memberCount: number): number {
  return sumPerPerson(draft, memberCount) - sumPerPerson(base, memberCount);
}

export function countByKind(changes: Change[]): Record<ChangeKind, number> {
  return changes.reduce(
    (acc, c) => ({ ...acc, [c.kind]: acc[c.kind] + 1 }),
    { moved: 0, edited: 0, added: 0, deleted: 0 } as Record<ChangeKind, number>,
  );
}

export function breakdownText(changes: Change[]): string {
  const counts = countByKind(changes);
  return (Object.keys(counts) as ChangeKind[])
    .filter((k) => counts[k] > 0)
    .map((k) => `${counts[k]} ${CHANGE_LABEL[k].toLowerCase()}`)
    .join(' · ');
}

/** "Ngày 2 · 4 thay đổi" */
export function requestTitle(changes: Change[], base: Block[], draft: Block[]): string {
  const all = new Map([...base, ...draft].map((b) => [b.id, b]));
  const days = Array.from(new Set(changes.map((c) => all.get(c.blockId)?.day ?? 0))).sort();
  const dayText = days.map((d) => dayLabel(d)).join(', ');
  return `${dayText} · ${changes.length} thay đổi`;
}

export function costDeltaText(delta: number): string {
  return delta === 0 ? 'Không đổi chi phí' : `${formatSignedK(delta)} / người`;
}

export function touchedBlockIds(changes: Change[]): Set<string> {
  return new Set(changes.map((c) => c.blockId));
}
