import type { DayNumber } from '@/modules/schedule/schedule.type';

export interface DraftBoardProps {
  day: Exclude<DayNumber, 0>;
}
