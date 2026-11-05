export interface EstimateVsActualProps {
  /** Tổng dự tính mỗi người của các mục đã xong */
  estimate: number;
  /** Tổng thực tế mỗi người */
  actual: number;
  /** Dự tính còn lại mỗi người */
  remaining: number;
}
