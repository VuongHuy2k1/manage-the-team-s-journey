export interface DiffSummaryProps {
  title: string;
  /** "1 dời · 1 sửa · 1 thêm · 1 xoá" */
  breakdown: string;
  /** Dự tính mỗi người trước và sau */
  before: number;
  after: number;
}
