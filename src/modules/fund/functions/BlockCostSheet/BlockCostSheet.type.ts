import type { BlockCostInput } from '@/core/store/trip.actions';
import type { Block } from '@/modules/schedule/schedule.type';

export interface BlockCostSheetProps {
  open: boolean;
  onClose: () => void;
  block: Block | null;
  memberCount: number;
  onSave: (input: BlockCostInput) => Promise<boolean>;
  /** Xoá mục; không truyền nếu mục đã hoàn thành */
  onDelete?: () => Promise<boolean>;
  /** Mục đã hoàn thành thì không xoá được */
  completed?: boolean;
}
