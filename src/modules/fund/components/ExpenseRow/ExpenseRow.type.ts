import type { ReactNode } from 'react';

export interface ExpenseRowProps {
  title: string;
  /** "Trừ quỹ · Hôm nay 14:20" */
  meta: string;
  amount: number;
  perPerson: number;
  note?: string;
  action?: ReactNode;
}
