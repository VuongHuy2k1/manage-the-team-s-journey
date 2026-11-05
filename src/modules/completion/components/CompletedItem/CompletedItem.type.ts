import type { ReactNode } from 'react';

export interface CompletedItemProps {
  title: string;
  /** Dòng phụ: giờ · cách trả */
  meta: string;
  actualPerPerson: number;
  estimatePerPerson: number | null;
  diff: number | null;
  trailing?: ReactNode;
}
