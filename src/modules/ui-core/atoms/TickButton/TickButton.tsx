import { cx } from '../../utils/classNames.utils';
import { Icon } from '../Icon/Icon';
import styles from './TickButton.module.scss';
import type { TickButtonProps } from './TickButton.type';

export function TickButton({ checked = false, pending = false, label, onClick, disabled }: TickButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      aria-label={label}
      aria-pressed={checked}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={cx(styles.circle, checked && styles.checked, pending && styles.pending)}>
        {(checked || pending) && <Icon name="check" size={14} strokeWidth={3} />}
      </span>
    </button>
  );
}
