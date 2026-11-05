import type { Block } from '../../schedule.type';

export interface ScheduleListProps {
  /** Các mốc chưa hoàn thành của ngày đang xem */
  blocks: Block[];
  memberCount: number;
  /** Mốc đang chờ nhóm trưởng xác nhận */
  pendingIds: Set<string>;
}
