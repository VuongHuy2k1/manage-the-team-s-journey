import type { Block } from '@/modules/schedule/schedule.type';

export interface ConfirmCompleteDialogProps {
  /** Mốc đang xác nhận, null = đóng */
  block: Block | null;
  onClose: () => void;
  /** Gọi sau khi nhóm trưởng xác nhận, hoặc thành viên gửi yêu cầu */
  onDone?: (result: { block: Block; confirmed: boolean }) => void;
}
