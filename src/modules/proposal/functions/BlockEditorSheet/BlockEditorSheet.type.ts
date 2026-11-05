import type { Block, DayNumber } from '@/modules/schedule/schedule.type';

export interface BlockEditorSheetProps {
  open: boolean;
  /** null = thêm khối mới */
  block: Block | null;
  defaultDay: DayNumber;
  memberCount: number;
  onClose: () => void;
  onSave: (block: Block) => void;
  onDelete?: (blockId: string) => void;
}
