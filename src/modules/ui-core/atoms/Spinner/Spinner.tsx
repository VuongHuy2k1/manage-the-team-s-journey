import styles from './Spinner.module.scss';
import type { SpinnerProps } from './Spinner.type';

/** Vòng xoay chờ, lấy màu theo chữ xung quanh */
export function Spinner({ size = 16, label }: SpinnerProps) {
  return (
    <span
      className={styles.spinner}
      style={{ width: size, height: size }}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
