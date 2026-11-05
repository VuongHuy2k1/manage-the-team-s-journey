import type { Change } from '../../proposal.type';

export interface ChangeItemProps {
  change: Change;
  /** compact: một dòng gọn trong thẻ yêu cầu · card: thẻ riêng có trước → sau */
  variant?: 'compact' | 'card';
}
