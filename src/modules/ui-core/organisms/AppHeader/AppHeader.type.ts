import type { ReactNode } from 'react';

export interface AppHeaderProps {
  title: string;
  /** Dòng chữ nhỏ phía trên tiêu đề */
  eyebrow?: string;
  /** brand: nền xanh thương hiệu · plain: nền trắng, dùng cho màn phụ */
  variant?: 'brand' | 'plain';
  /** Có thì hiện nút quay lại */
  backHref?: string;
  /** Nội dung bên phải tiêu đề */
  aside?: ReactNode;
  /** Hàng dưới tiêu đề: tab ngày, thẻ số dư… */
  children?: ReactNode;
  /** Hoạ tiết đồi thông phía sau */
  decorated?: boolean;
}
