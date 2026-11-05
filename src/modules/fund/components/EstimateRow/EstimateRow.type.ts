import type { ReactNode } from 'react';

export interface EstimateRowProps {
  title: string;
  /** Dòng phụ: giờ, ghi chú… */
  meta?: ReactNode;
  /** Dự tính cả nhóm, null = chưa có giá */
  total: number | null;
  perPerson: number | null;
  /** Nhãn thay số tiền ("Tự túc"…) */
  costLabel?: string;
  /** Đã chi thực tế (nếu đã xong) */
  actual?: number;
  done?: boolean;
  onClick?: () => void;
}
