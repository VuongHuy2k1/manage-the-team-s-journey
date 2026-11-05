import type { TripSummary } from '../../fund.type';

export interface TripSummaryCardProps {
  summary: TripSummary;
  /** Link sang bảng dự tính chi tiết */
  estimateHref?: string;
  /** Link sang tổng kết thực chi */
  actualHref?: string;
}
