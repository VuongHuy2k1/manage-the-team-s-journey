import type { Member } from '../../member.type';

export interface CallMemberDialogProps {
  /** Người cần gọi, null = đóng */
  member: Member | null;
  onClose: () => void;
}
