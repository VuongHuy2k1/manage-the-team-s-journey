import type { ReactNode } from 'react';

export interface ScheduleTemplateProps {
  header: ReactNode;
  /** Các dải thông báo phía trên danh sách */
  notices?: ReactNode;
  children: ReactNode;
  /** Nút nổi góc phải dưới */
  fab?: ReactNode;
  nav: ReactNode;
}
