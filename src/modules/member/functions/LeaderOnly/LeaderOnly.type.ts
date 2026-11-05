import type { ReactNode } from 'react';

export interface LeaderOnlyProps {
  children: ReactNode;
  /** Hiện cho thành viên không phải nhóm trưởng */
  fallback?: ReactNode;
}
