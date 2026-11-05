import type { Block } from '@/modules/schedule/schedule.type';

export type ChangeKind = 'moved' | 'edited' | 'added' | 'deleted';

export interface Change {
  kind: ChangeKind;
  blockId: string;
  title: string;
  before?: string;
  after?: string;
}

export type VoteValue = 'up' | 'down';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface ScheduleRequest {
  id: string;
  authorId: string;
  createdAt: string;
  /** Ví dụ "Ngày 2 · 4 thay đổi" */
  title: string;
  reason: string;
  baseVersion: number;
  changes: Change[];
  /** Bản nháp đầy đủ tại lúc gửi */
  draft: Block[];
  /** Chênh lệch dự tính mỗi người so với lịch gốc */
  costDeltaPerPerson: number;
  status: RequestStatus;
  votes: Record<string, VoteValue>;
  decidedBy?: string;
  decidedAt?: string;
  rejectReason?: string;
}

export type VersionType = 'create' | 'approve' | 'restore' | 'edit';

export interface Version {
  number: number;
  type: VersionType;
  at: string;
  title: string;
  proposedBy: string;
  decidedBy: string;
  requestId?: string;
  changes: Change[];
  schedule: Block[];
}

export interface Draft {
  blocks: Block[];
  baseVersion: number;
  updatedAt: string;
}
