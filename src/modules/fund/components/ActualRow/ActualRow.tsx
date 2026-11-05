import { DiffTag, MoneyText } from '@/modules/ui-core';
import styles from './ActualRow.module.scss';
import type { ActualRowProps } from './ActualRow.type';

export function ActualRow({ title, meta, actual, perPerson, estimate }: ActualRowProps) {
  return (
    <div className={styles.row}>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {meta && <span className={styles.meta}>{meta}</span>}
      </span>
      <span className={styles.money}>
        <MoneyText value={actual} size={14} />
        <span className={styles.per}>
          <MoneyText value={perPerson} format="k" weight={500} /> / người
        </span>
        {estimate !== null && (
          <span className={styles.compare}>
            DT <MoneyText value={estimate} format="k" weight={500} /> <DiffTag diff={actual - estimate} />
          </span>
        )}
      </span>
    </div>
  );
}
