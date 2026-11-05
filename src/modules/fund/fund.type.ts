export interface Contribution {
  paid: boolean;
  amount: number;
  at?: string;
}

export interface RoundPayment {
  paid: boolean;
  /** Số tiền đã nộp lần này (lấy theo mức của lần thu) */
  amount: number;
  at?: string;
  /** Ai đánh dấu */
  by?: string;
}

/** Một lần thu quỹ: lần đầu, nộp bổ sung… mỗi lần một danh sách đã nộp riêng */
export interface FundRound {
  id: string;
  title: string;
  /** Mức nộp mỗi người */
  amount: number;
  note?: string;
  createdAt: string;
  createdBy?: string;
  payments: Record<string, RoundPayment>;
}

export type ExpensePayMethod = 'fund' | 'advance' | 'self';

/** Khoản chi ngoài lịch trình: tiền xăng, thuốc, đồ ăn vặt… */
export interface ExtraExpense {
  id: string;
  title: string;
  /** Tổng cả nhóm (VNĐ) */
  amount: number;
  payMethod: ExpensePayMethod;
  paidBy?: string;
  note?: string;
  at: string;
  by: string;
  /** Chi cho khoản dự tính nào (nếu có) */
  plannedId?: string;
}

/** Khoản dự tính ngoài lịch trình: tiền nhà, xe khứ hồi… */
export interface PlannedCost {
  id: string;
  title: string;
  /** Dự tính cả nhóm (VNĐ) */
  amount: number;
  note?: string;
  createdAt: string;
  by: string;
  /** Đã chi thật bằng khoản chi nào */
  expenseId?: string;
}

export type LedgerKind =
  | 'round'
  | 'round-undo'
  | 'completion'
  | 'completion-undo'
  | 'expense'
  | 'expense-undo'
  | 'adjust';

/** Một dòng lịch sử cộng / trừ quỹ */
export interface LedgerEntry {
  id: string;
  at: string;
  by: string;
  /** Dương = cộng vào quỹ, âm = trừ */
  amount: number;
  kind: LedgerKind;
  label: string;
  balanceAfter: number;
}

export interface MomoInfo {
  accountName: string;
  phone: string;
  /** Nội dung chuyển khoản gợi ý */
  note: string;
  /** Ảnh QR (data URL) do nhóm trưởng tải lên */
  qrDataUrl: string | null;
  /** Link quỹ nhóm trên MoMo để thành viên xem */
  fundLink?: string;
}

export interface Fund {
  balance: number;
  balanceUpdatedAt: string | null;
  balanceUpdatedBy: string | null;
  /** Mức góp lần đầu (dữ liệu cũ, giờ dùng rounds) */
  target: number;
  /** Danh sách đã góp lần đầu (dữ liệu cũ, giờ dùng rounds) */
  contributions: Record<string, Contribution>;
  /** Các lần thu quỹ */
  rounds?: FundRound[];
  /** Khoản chi ngoài lịch trình */
  expenses?: ExtraExpense[];
  /** Khoản dự tính ngoài lịch trình */
  planned?: PlannedCost[];
  /** Lịch sử cộng / trừ quỹ, mới nhất trước */
  ledger?: LedgerEntry[];
  momo: MomoInfo;
}

export interface TripSummary {
  memberCount: number;
  totalEstimate: number;
  /** Phần dự tính ngoài lịch trình (đã nằm trong totalEstimate) */
  plannedEstimate: number;
  spentActual: number;
  spentCount: number;
  remainingEstimate: number;
  remainingCount: number;
  contributed: number;
  balance: number;
  leftover: number;
  perPerson: {
    estimate: number;
    spent: number;
    remaining: number;
    leftover: number;
  };
}
