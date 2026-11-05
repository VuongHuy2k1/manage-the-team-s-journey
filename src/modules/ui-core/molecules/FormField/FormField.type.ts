import type { ReactNode } from 'react';

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  /** Nội dung bên phải nhãn, ví dụ thẻ "Nhóm trưởng nhập" */
  aside?: ReactNode;
  children: ReactNode;
}
