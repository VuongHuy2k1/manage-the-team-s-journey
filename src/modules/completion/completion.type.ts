export type PayMethod = 'fund' | 'advance' | 'self';

export interface Completion {
  blockId: string;
  /** Tổng thực tế cả nhóm (VNĐ) */
  actualTotal: number;
  payMethod: PayMethod;
  /** Người ứng trước khi payMethod = advance */
  paidBy?: string;
  confirmedBy: string;
  at: string;
}

export interface PendingCompletion {
  blockId: string;
  requestedBy: string;
  at: string;
}
