import type { PlannedCostInput } from '@/core/store/trip.actions';
import type { PlannedCost } from '../../fund.type';

export interface PlannedCostSheetProps {
  open: boolean;
  onClose: () => void;
  /** Có thì đang sửa, không có thì thêm mới */
  item: PlannedCost | null;
  memberCount: number;
  onSave: (input: PlannedCostInput) => Promise<boolean>;
  onDelete?: () => void;
}
