import { Icon, MoneyText } from '@/modules/ui-core';
import styles from './DiffSummary.module.scss';
import type { DiffSummaryProps } from './DiffSummary.type';

export function DiffSummary({ title, breakdown, before, after }: DiffSummaryProps) {
  const delta = after - before;
  return (
    <section className={styles.card} aria-label="Tóm tắt thay đổi">
      <div className={styles.head}>
        <span className={styles.title}>{title}</span>
        <span className={styles.breakdown}>{breakdown}</span>
      </div>
      <div className={styles.money}>
        <span className={styles.label}>Dự tính / người</span>
        <MoneyText value={before} format="k" strike tone="inverse" weight={500} />
        <Icon name="arrow-right" size={16} />
        <MoneyText value={after} format="k" size={17} tone="inverse" />
        {delta !== 0 && (
          <span className={styles.delta}>
            <MoneyText value={delta} format="k" signed />
          </span>
        )}
      </div>
    </section>
  );
}
