import type { BottomNavItem } from '@/modules/ui-core/organisms/BottomNav/BottomNav.type';
import { ROUTES } from './routes.config';

export const MAIN_NAV: BottomNavItem[] = [
  { key: 'schedule', label: 'Lịch trình', href: ROUTES.schedule, icon: 'calendar' },
  { key: 'completed', label: 'Đã xong', href: ROUTES.completed, icon: 'check-circle' },
  { key: 'requests', label: 'Yêu cầu', href: ROUTES.requests, icon: 'list' },
  { key: 'location', label: 'Vị trí', href: ROUTES.location, icon: 'pin' },
  { key: 'fund', label: 'Quỹ', href: ROUTES.fund, icon: 'coin' },
];
