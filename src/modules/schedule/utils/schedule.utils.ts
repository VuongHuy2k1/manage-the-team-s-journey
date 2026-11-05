import { formatK, splitPerPerson } from '@/modules/ui-core/utils/money.utils';
import type { Block, Category, DayNumber } from '../schedule.type';

export const TRIP_DAYS: { value: Exclude<DayNumber, 0>; label: string; title: string }[] = [
  { value: 1, label: 'Ngày 1', title: 'Đến nơi, dạo trung tâm' },
  { value: 2, label: 'Ngày 2', title: 'Tuyền Lâm & phố cổ' },
  { value: 3, label: 'Ngày 3', title: 'Langbiang, về lại SG' },
];

export const CATEGORY_LABEL: Record<Category, string> = {
  food: 'Ăn uống',
  place: 'Tham quan',
  move: 'Di chuyển',
  rest: 'Nghỉ ngơi',
};

export const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABEL) as Category[]).map((value) => ({
  value,
  label: CATEGORY_LABEL[value],
}));

export function dayLabel(day: DayNumber): string {
  return day === 0 ? 'Trước chuyến' : `Ngày ${day}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h)) return -1;
  return h * 60 + (m || 0);
}

export function sortBlocks(blocks: Block[]): Block[] {
  return [...blocks].sort((a, b) => a.day - b.day || timeToMinutes(a.time) - timeToMinutes(b.time));
}

export function blocksOfDay(blocks: Block[], day: DayNumber): Block[] {
  return sortBlocks(blocks.filter((b) => b.day === day));
}

/** Dự tính mỗi người, null nếu chưa có giá */
export function estimatePerPerson(block: Block, memberCount: number): number | null {
  if (!block.estimate) return null;
  return block.estimate.unit === 'person'
    ? block.estimate.amount
    : splitPerPerson(block.estimate.amount, memberCount);
}

/** Dự tính cả nhóm, null nếu chưa có giá */
export function estimateGroup(block: Block, memberCount: number): number | null {
  if (!block.estimate) return null;
  return block.estimate.unit === 'group' ? block.estimate.amount : block.estimate.amount * memberCount;
}

export function sumPerPerson(blocks: Block[], memberCount: number): number {
  return blocks.reduce((sum, b) => sum + (estimatePerPerson(b, memberCount) ?? 0), 0);
}

export function costText(block: Block, memberCount: number): string {
  if (block.costLabel) return block.costLabel;
  const value = estimatePerPerson(block, memberCount);
  if (value === null) return 'Chưa có giá';
  if (value === 0) return 'Miễn phí';
  return `${formatK(value)} / người`;
}

export function positionText(block: Block): string {
  return block.day === 0 ? dayLabel(0) : `${dayLabel(block.day)} · ${block.time}`;
}
