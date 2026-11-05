import { Icon, MoneyText, cx } from '@/modules/ui-core';
import styles from './LedgerRow.module.scss';
import type { LedgerRowProps } from './LedgerRow.type';

export function LedgerRow({ entry, byName, when }: LedgerRowProps) {
  const isIn = entry.amount > 0;
  return (
    <div className={styles.row}>
      <span className={cx(styles.icon, isIn ? styles.in : styles.out)}>
        <Icon name={isIn ? 'arrow-down-right' : 'arrow-up-right'} size={16} strokeWidth={2.4} />
      </span>
      <span className={styles.text}>
        <span className={styles.label}>{entry.label}</span>
        <span className={styles.meta}>{when} · {byName}</span>
      </span>
      <span className={styles.money}>
        <MoneyText value={entry.amount} signed tone={isIn ? 'success' : 'danger'} size={14} />
        <span className={styles.after}>Còn <MoneyText value={entry.balanceAfter} format="k" weight={500} /></span>
      </span>
    </div>
  );
}
