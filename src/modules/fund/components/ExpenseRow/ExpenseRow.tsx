import { MoneyText } from '@/modules/ui-core';
import styles from './ExpenseRow.module.scss';
import type { ExpenseRowProps } from './ExpenseRow.type';

export function ExpenseRow({ title, meta, amount, perPerson, note, action }: ExpenseRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.meta}>{meta}</span>
        {note && <span className={styles.note}>{note}</span>}
      </div>
      <div className={styles.money}>
        <MoneyText value={amount} size={14} />
        <span className={styles.per}><MoneyText value={perPerson} format="k" weight={500} /> / người</span>
      </div>
      {action}
    </div>
  );
}
