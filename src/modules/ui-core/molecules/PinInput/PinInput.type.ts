export interface PinInputProps {
  id: string;
  /** Số ô, mặc định 6 */
  length?: number;
  value: string;
  onChange: (value: string) => void;
  /** Gọi khi nhập đủ số ô */
  onComplete?: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  label: string;
  autoFocus?: boolean;
}
