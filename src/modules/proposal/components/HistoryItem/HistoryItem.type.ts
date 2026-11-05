import type { ReactNode } from 'react';
import type { Change } from '../../proposal.type';

export type HistoryItemStatus = 'create' | 'approve' | 'restore' | 'edit' | 'reject';

export interface HistoryItemProps {
  status: HistoryItemStatus;
  versionLabel?: string;
  when: string;
  title: string;
  proposedByName: string;
  /** "Nhân duyệt · 7/9 đồng ý" */
  decisionText: string;
  changes: Change[];
  note?: string;
  /** Nút khôi phục */
  action?: ReactNode;
}
