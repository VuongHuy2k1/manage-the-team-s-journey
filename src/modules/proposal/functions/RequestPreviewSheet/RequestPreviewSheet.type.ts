import type { ReactNode } from 'react';
import type { ScheduleRequest } from '../../proposal.type';

export interface RequestPreviewSheetProps {
  /** Yêu cầu đang xem, null = đóng */
  request: ScheduleRequest | null;
  onClose: () => void;
  /** Nút duyệt / từ chối hiển thị ở chân (chỉ nhóm trưởng) */
  actions?: ReactNode;
}
