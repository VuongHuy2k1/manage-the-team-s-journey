import type { CreateRoundInput } from '@/core/store/trip.actions';

export interface CreateRoundSheetProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateRoundInput) => Promise<boolean>;
  suggestion: { title: string; amount: number; shortage: number };
  memberCount: number;
}
