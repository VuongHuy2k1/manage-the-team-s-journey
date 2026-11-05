export interface ProgressSegment {
  value: number;
  color: string;
}

export interface ProgressBarProps {
  /** 0–100, bỏ qua khi có segments */
  value?: number;
  color?: string;
  /** Nhiều đoạn màu nối nhau, tổng tối đa 100 */
  segments?: ProgressSegment[];
  height?: number;
  label?: string;
}
