export type IconName =
  | 'calendar' | 'check' | 'check-circle' | 'list' | 'coin' | 'navigate' | 'pin'
  | 'edit' | 'plus' | 'back' | 'close' | 'grip' | 'trash' | 'camera' | 'copy'
  | 'arrow-right' | 'arrow-up-right' | 'arrow-down-right' | 'history' | 'user' | 'thumb-up' | 'thumb-down' | 'refresh' | 'lock' | 'users' | 'logout';

export interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  /** Có nhãn thì icon được đọc bởi trình đọc màn hình, không thì ẩn */
  label?: string;
}
