export interface ActualRowProps {
  title: string;
  meta?: string;
  /** Thực chi cả nhóm */
  actual: number;
  perPerson: number;
  /** Dự tính cả nhóm để so sánh, null = không có */
  estimate: number | null;
}
