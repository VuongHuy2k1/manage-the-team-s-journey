import type { IconName } from '../../atoms/Icon/Icon.type';

export interface BottomNavItem {
  key: string;
  label: string;
  href: string;
  icon: IconName;
  /** Số chấm báo, ví dụ số yêu cầu chờ duyệt */
  badge?: number;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  activeKey: string;
}
