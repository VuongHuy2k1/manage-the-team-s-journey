import { cx } from '../../utils/classNames.utils';
import styles from './StatRow.module.scss';
import type { StatRowProps } from './StatRow.type';

export function StatRow({ label, value, strong, divider, tone = 'default' }: StatRowProps) {
  return (
    <div className={cx(styles.row, strong && styles.strong, divider && styles.divider, styles[tone])}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
