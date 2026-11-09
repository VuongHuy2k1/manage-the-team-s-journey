import type { DayNumber } from '@/modules/schedule/schedule.type';

export interface DraftBoardProps {
  day: Exclude<DayNumber, 0>;
  /** Gọi sau khi kéo thẻ sang ngày khác, để chuyển tab theo */
  onDayChange?: (day: Exclude<DayNumber, 0>) => void;
  /** Phát hoạt ảnh gợi ý trên thẻ đầu tiên (sau khi xem hướng dẫn) */
  demo?: boolean;
}
