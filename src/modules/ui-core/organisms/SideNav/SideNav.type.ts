import type { ReactNode } from 'react';
import type { BottomNavItem } from '../BottomNav/BottomNav.type';

export interface SideNavProps {
  items: BottomNavItem[];
  activeKey?: string;
  /** Phần đầu: tên chuyến */
  header?: ReactNode;
  /** Phần cuối: tài khoản */
  footer?: ReactNode;
}
