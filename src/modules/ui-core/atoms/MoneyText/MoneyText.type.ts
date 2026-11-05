export type MoneyTone = 'default' | 'muted' | 'danger' | 'success' | 'warn' | 'inverse';

export interface MoneyTextProps {
  value: number;
  /** full: 1.238.000đ · k: 1.238k */
  format?: 'full' | 'k';
  /** Hiện dấu + / − */
  signed?: boolean;
  tone?: MoneyTone;
  size?: number;
  weight?: 500 | 600 | 700;
  strike?: boolean;
}
