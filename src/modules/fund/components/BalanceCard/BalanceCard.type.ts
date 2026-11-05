import type { ReactNode } from 'react';

export interface BalanceCardProps {
  balance: number;
  updatedText: string;
  contributed: number;
  spent: number;
  /** Nút "Sửa số dư" cho nhóm trưởng */
  action?: ReactNode;
}
