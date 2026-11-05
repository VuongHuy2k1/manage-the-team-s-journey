import { MoneyText } from '@/modules/ui-core';
import styles from './PerPersonGrid.module.scss';
import type { PerPersonGridProps } from './PerPersonGrid.type';

export function PerPersonGrid({ perPerson: p }: PerPersonGridProps) {
  const cells = [
    { label: 'Dự tính / người', value: p.estimate },
    { label: 'Đã chi / người', value: p.spent },
    { label: 'Còn phải chi / người', value: p.remaining },
  ];
  return (
    <section className={styles.card} aria-label="Theo đầu người">
      <span className={styles.label}>Theo đầu người</span>
      <div className={styles.grid}>
        {cells.map((c) => (
          <div key={c.label} className={styles.cell}>
            <span className={styles.cellLabel}>{c.label}</span>
            <MoneyText value={c.value} size={16} />
          </div>
        ))}
        <div className={styles.cell}>
          <span className={styles.cellLabel}>{p.leftover >= 0 ? 'Thừa trả lại / người' : 'Cần góp thêm / người'}</span>
          <MoneyText value={Math.abs(p.leftover)} size={16} tone={p.leftover >= 0 ? 'success' : 'danger'} />
        </div>
      </div>
    </section>
  );
}
