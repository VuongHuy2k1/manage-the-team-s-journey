import type { IconName } from '@/modules/ui-core';

export interface RoleCardProps {
  icon: IconName;
  title: string;
  description: string;
  onClick: () => void;
  /** Thẻ nhóm trưởng có nhãn "Cần mã" */
  tag?: string;
}
