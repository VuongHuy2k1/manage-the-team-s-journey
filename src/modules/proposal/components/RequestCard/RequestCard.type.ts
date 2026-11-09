import type { ReactNode } from 'react';
import type { Change } from '../../proposal.type';

export interface RequestCardProps {
  title: string;
  authorName: string;
  /** "5 phút trước" */
  when: string;
  costText: string;
  reason?: string;
  changes: Change[];
  /** Hàng bình chọn */
  votes?: ReactNode;
  /** Dòng kiểm tra trùng */
  conflict?: { hasConflict: boolean; titles: string[] };
  /** Nút hành động */
  children?: ReactNode;
  highlight?: boolean;
  /** Bấm vào phần nội dung để xem chi tiết */
  onOpen?: () => void;
}
