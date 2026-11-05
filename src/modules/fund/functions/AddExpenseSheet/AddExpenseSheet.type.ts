import type { AddExpenseInput } from '@/core/store/trip.actions';
import type { Member } from '@/modules/member/member.type';

export interface AddExpenseSheetProps {
  open: boolean;
  onClose: () => void;
  onAdd: (input: AddExpenseInput) => Promise<boolean>;
  members: Member[];
  meId: string;
  fundBalance: number;
  /** Điền sẵn khi ghi chi cho một khoản dự tính */
  initial?: { title: string; amount: number; plannedId: string };
}
