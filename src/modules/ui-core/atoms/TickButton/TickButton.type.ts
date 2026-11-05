export interface TickButtonProps {
  checked?: boolean;
  /** Đang chờ nhóm trưởng xác nhận */
  pending?: boolean;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}
