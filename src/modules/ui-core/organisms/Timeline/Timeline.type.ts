import type { ReactNode } from 'react';

export interface TimelineItem {
  key: string;
  /** Màu chấm mốc */
  color: string;
  content: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
}
