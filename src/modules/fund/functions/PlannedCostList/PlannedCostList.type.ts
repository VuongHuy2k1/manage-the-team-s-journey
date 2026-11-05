import type { useEstimate } from '../../hooks/useEstimate.hook';

export interface PlannedCostListProps {
  estimate: ReturnType<typeof useEstimate>;
}
