import { DiffTag, Icon, MoneyText } from '@/modules/ui-core';
import styles from './CompletedItem.module.scss';
import type { CompletedItemProps } from './CompletedItem.type';

export function CompletedItem({ title, meta, actualPerPerson, estimatePerPerson, diff, trailing }: CompletedItemProps) {
  return (
    <div className={styles.item}>
      <span className={styles.check}>
        <Icon name="check" size={14} strokeWidth={3} />
      </span>
      <div className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.meta}>{meta}</span>
      </div>
      <div className={styles.money}>
        <MoneyText value={actualPerPerson} format="k" size={14} />
        <span className={styles.compare}>
          {estimatePerPerson === null ? (
            <span className={styles.est}>Chưa có dự tính</span>
          ) : (
            <span className={styles.est}>DT <MoneyText value={estimatePerPerson} format="k" weight={500} /></span>
          )}
          {diff !== null && <DiffTag diff={diff} />}
        </span>
      </div>
      {trailing}
    </div>
  );
}
