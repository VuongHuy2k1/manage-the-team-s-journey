import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.type';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Giãn hết chiều ngang */
  block?: boolean;
  icon?: IconName;
  /** Có href thì hiển thị dạng liên kết chuyển trang */
  href?: string;
  children?: ReactNode;
  /** Đang xử lý: hiện vòng xoay và khoá nút */
  loading?: boolean;
  /** Chữ hiển thị khi đang xử lý (mặc định giữ chữ cũ) */
  loadingText?: ReactNode;
  /**
   * Trả về Promise thì nút tự hiện loading và chặn bấm tiếp
   * cho tới khi Promise xong (tránh gửi trùng).
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => unknown;
}
