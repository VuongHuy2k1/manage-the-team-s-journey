/** 0 = chi phí chung trước chuyến (xe khứ hồi, tiền nhà) */
export type DayNumber = 0 | 1 | 2 | 3;

export type Category = 'food' | 'place' | 'move' | 'rest';

/** Chi phí nhập theo mỗi người hay cả nhóm (cả nhóm sẽ tự chia đầu người) */
export type CostUnit = 'person' | 'group';

export interface Estimate {
  amount: number;
  unit: CostUnit;
}

export interface Block {
  id: string;
  day: DayNumber;
  /** HH:mm, rỗng với chi phí chung */
  time: string;
  title: string;
  category: Category;
  address: string;
  /** Từ khoá tìm trên Google Maps khi địa chỉ chưa rõ */
  mapQuery?: string;
  /** Toạ độ ghim trên bản đồ (chính xác hơn địa chỉ chữ) */
  lat?: number;
  lng?: number;
  note?: string;
  /** null = chưa có giá */
  estimate: Estimate | null;
  /** Nhãn thay cho số tiền, ví dụ "Đã tính tiền nhà", "Tự túc" */
  costLabel?: string;
}
