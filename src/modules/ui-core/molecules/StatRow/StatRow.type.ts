import type { ReactNode } from 'react';

export interface StatRowProps {
  label: ReactNode;
  value: ReactNode;
  /** In đậm cả dòng (dòng tổng) */
  strong?: boolean;
  /** Kẻ đường phân cách phía trên */
  divider?: boolean;
  tone?: 'default' | 'success';
}
