import { Button, MoneyText, ProgressBar, StatRow } from '@/modules/ui-core';
import styles from './TripSummaryCard.module.scss';
import type { TripSummaryCardProps } from './TripSummaryCard.type';

export function TripSummaryCard({ summary: s, estimateHref, actualHref }: TripSummaryCardProps) {
  const base = Math.max(1, s.spentActual + s.remainingEstimate);
  const short = s.leftover < 0;
  return (
    <section className={styles.card} aria-label="Tổng kết cả chuyến">
      <div className={styles.head}>
        <span className={styles.label}>Tổng kết cả chuyến</span>
        <span className={styles.sub}>cả nhóm {s.memberCount} người</span>
      </div>
      <StatRow label="Tổng dự tính" value={<MoneyText value={s.totalEstimate} />} />
      {s.plannedEstimate > 0 && (
        <span className={styles.formula}>
          Lịch trình <MoneyText value={s.totalEstimate - s.plannedEstimate} format="k" weight={500} /> + khoản thêm <MoneyText value={s.plannedEstimate} format="k" weight={500} />
        </span>
      )}
      <StatRow label={<>Đã chi thực tế <span className={styles.muted}>({s.spentCount} mục)</span></>} value={<MoneyText value={s.spentActual} />} />
      <StatRow label={<>Dự tính còn chi <span className={styles.muted}>({s.remainingCount} mục)</span></>} value={<MoneyText value={s.remainingEstimate} />} />
      <ProgressBar
        height={10}
        label={`Đã chi ${Math.round((s.spentActual / base) * 100)}%`}
        segments={[
          { value: (s.spentActual / base) * 100, color: 'var(--c-primary)' },
          { value: (s.remainingEstimate / base) * 100, color: '#A3C1FF' },
        ]}
      />
      <div className={short ? styles.short : styles.leftover}>
        <span>{short ? 'Quỹ dự kiến thiếu' : 'Tiền thừa dự kiến'}</span>
        <MoneyText value={Math.abs(s.leftover)} />
      </div>
      <span className={styles.formula}>= Số dư quỹ − dự tính còn chi.{short ? ' Cả nhóm cần góp thêm.' : ''}</span>
      {(estimateHref || actualHref) && (
        <div className={styles.links}>
          {estimateHref && <Button href={estimateHref} icon="list" block>Bảng dự tính</Button>}
          {actualHref && <Button href={actualHref} icon="check-circle" block>Tổng kết thực chi</Button>}
        </div>
      )}
    </section>
  );
}
