import type { ReactNode } from 'react';
import type { IconName } from '../../atoms/Icon/Icon.type';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Dòng phụ dưới tiêu đề */
  subtitle?: ReactNode;
  icon?: IconName;
  iconTone?: 'primary' | 'success' | 'warn';
  children?: ReactNode;
  /** Các nút hành động, đặt ở cuối */
  actions: ReactNode;
}
