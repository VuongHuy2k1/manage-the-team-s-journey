import type { ReactNode } from 'react';
import type { MomoInfo } from '../../fund.type';

export interface MomoQrCardProps {
  momo: MomoInfo;
  /** Mức nộp mỗi người của lần thu mới nhất */
  target: number;
  /** Tên lần thu, ví dụ "Nộp bổ sung lần 2" */
  targetLabel?: string;
  actions?: ReactNode;
  /** Link quỹ nhóm trên MoMo */
  fundLink?: string;
  /** Bấm vào mã QR để phóng to */
  onQrClick?: () => void;
}
