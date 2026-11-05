import type { ReactNode } from 'react';
import type { Member } from '../../member.type';

export interface MemberRowProps {
  member: Member;
  isLeader: boolean;
  isMe: boolean;
  /** Dòng phụ: email, ngày vào nhóm… */
  meta?: string;
  action?: ReactNode;
  muted?: boolean;
}
