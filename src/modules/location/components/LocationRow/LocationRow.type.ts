import type { Member } from '@/modules/member/member.type';

export interface LocationRowProps {
  member: Member;
  isMe: boolean;
  /** "Cách 1,2 km · 3 phút trước" hoặc "Chưa chia sẻ" */
  status: string;
  stale: boolean;
  visible: boolean;
  directionsUrl?: string;
  onFocus?: () => void;
  /** Bấm nút gọi (không truyền thì ẩn nút) */
  onCall?: () => void;
  /** Thành viên đã lưu số điện thoại chưa */
  hasPhone?: boolean;
}
