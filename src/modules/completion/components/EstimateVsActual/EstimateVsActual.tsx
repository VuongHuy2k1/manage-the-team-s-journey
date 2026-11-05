import { MoneyText, ProgressBar } from '@/modules/ui-core';
import styles from './EstimateVsActual.module.scss';
import type { EstimateVsActualProps } from './EstimateVsActual.type';

export function EstimateVsActual({ estimate, actual, remaining }: EstimateVsActualProps) {
  const max = Math.max(estimate, actual, 1);
  const diff = actual - estimate;
  const pct = estimate ? Math.round((diff / estimate) * 1000) / 10 : 0;
  return (
    <section className={styles.card} aria-label="Dự tính so với thực tế">
      <div className={styles.grid}>
        <div className={styles.cell}>
          <span className={styles.label}>Dự tính</span>
          <MoneyText value={estimate} size={18} tone="muted" />
        </div>
        <div className={styles.cell}>
          <span className={styles.label}>Thực tế</span>
          <MoneyText value={actual} size={18} />
        </div>
      </div>
      <div className={styles.bars}>
        <ProgressBar value={(estimate / max) * 100} color="var(--c-subtle)" label="Dự tính" />
        <ProgressBar value={(actual / max) * 100} label="Thực tế" />
      </div>
      <div className={styles.foot}>
        <span className={diff > 0 ? styles.over : diff < 0 ? styles.under : styles.even}>
          {diff === 0 ? 'Khớp dự tính' : diff > 0 ? 'Vượt ' : 'Tiết kiệm '}
          {diff !== 0 && <MoneyText value={Math.abs(diff)} />}
          {diff !== 0 && <span className={styles.pct}> ({diff > 0 ? '+' : '−'}{Math.abs(pct).toLocaleString('vi-VN')}%)</span>}
        </span>
        <span className={styles.remaining}>
          Còn lại dự tính <MoneyText value={remaining} format="k" />
        </span>
      </div>
    </section>
  );
}
