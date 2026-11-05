import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputBase {
  /** Chữ số canh đều (dùng cho tiền, giờ) */
  mono?: boolean;
  invalid?: boolean;
  /** Cỡ chữ lớn cho ô nhập chính */
  large?: boolean;
}

export type InputProps =
  | (InputBase & { multiline?: false } & InputHTMLAttributes<HTMLInputElement>)
  | (InputBase & { multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>);
