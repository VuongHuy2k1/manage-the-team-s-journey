export interface ResetOptionProps {
  id: string;
  title: string;
  description: string;
  /** Ví dụ "12 phiên bản" */
  count?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}
