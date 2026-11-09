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
  /** Các mốc đang có trong bản nháp, để cảnh báo trùng giờ */
  existing?: Block[];
  /** Mở mốc đang có (trùng giờ) để sửa thay vì tạo mới */
  onEditExisting?: (block: Block) => void;
}
