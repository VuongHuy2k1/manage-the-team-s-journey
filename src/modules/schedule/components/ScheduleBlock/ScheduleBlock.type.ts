import type { ReactNode } from 'react';
import type { Block } from '../../schedule.type';

export type ScheduleBlockTone = 'default' | 'moved' | 'edited' | 'added' | 'deleted' | 'lifted';

export interface ScheduleBlockProps {
  block: Block;
  memberCount: number;
  /** Bên trái, ví dụ tay nắm kéo thả */
  leading?: ReactNode;
  /** Bên phải, ví dụ nút chỉ đường, nút tick */
  trailing?: ReactNode;
  /** Nhãn thay đổi: Đã dời / Đã sửa… */
  badge?: ReactNode;
  /** Giờ cũ (gạch ngang) khi khối bị dời */
  oldTime?: string;
  tone?: ScheduleBlockTone;
  /** Thêm dòng phụ, ví dụ "Chờ nhóm trưởng xác nhận" */
  status?: ReactNode;
  /** Bấm vào thân khối */
  onSelect?: () => void;
}
