import { Icon } from '../../atoms/Icon/Icon';
import styles from './Toast.module.scss';
import type { ToastProps } from './Toast.type';

export function Toast({ open, message, actionLabel, onAction }: ToastProps) {
  if (!open) return null;
  return (
    <div className={styles.toast} role="status">
      <Icon name="check" size={18} strokeWidth={2.6} className={styles.icon} />
      <span className={styles.message}>{message}</span>
      {actionLabel && onAction && (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
