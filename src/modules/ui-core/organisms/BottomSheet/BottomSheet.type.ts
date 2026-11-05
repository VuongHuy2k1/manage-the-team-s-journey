import type { ReactNode } from 'react';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** Nhãn cho trình đọc màn hình */
  label: string;
  /** Dòng nhỏ phía trên, ví dụ thẻ "Sửa trong bản nháp" */
  header?: ReactNode;
  children: ReactNode;
  /** Thanh nút cố định dưới cùng */
  footer?: ReactNode;
}
