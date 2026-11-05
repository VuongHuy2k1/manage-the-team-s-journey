import { MoneyText } from '@/modules/ui-core';
import styles from './DayHeader.module.scss';
import type { DayHeaderProps } from './DayHeader.type';

export function DayHeader({ title, totalPerPerson }: DayHeaderProps) {
  return (
    <div className={styles.head}>
      <h2 className={styles.title}>{title}</h2>
      <span className={styles.total}>
        Dự tính <MoneyText value={totalPerPerson} format="k" /> / người
      </span>
    </div>
  );
}
