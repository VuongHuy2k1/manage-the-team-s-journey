export type MemberRole = 'leader' | 'member';

export interface Member {
  /** uid tài khoản Firebase */
  id: string;
  /** Email Google, giúp nhóm trưởng nhận ra ai là ai */
  email: string;
  /** Tên hiển thị */
  name: string;
  /** Màu đại diện khi chưa có ảnh */
  color: string;
  /** Ảnh đại diện đã nén (data URL), null nếu chưa có */
  avatar: string | null;
  role: MemberRole;
  /** Bị nhóm trưởng xoá khỏi nhóm */
  removed: boolean;
  joinedAt: string;
  removedAt?: string;
  removedBy?: string;
}
