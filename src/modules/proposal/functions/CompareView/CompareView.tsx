'use client';

import { TRIP_DAYS, blocksOfDay } from '@/modules/schedule/utils/schedule.utils';
import { SegmentedControl, cx } from '@/modules/ui-core';
import { ChangeItem } from '../../components/ChangeItem/ChangeItem';
import { DiffSummary } from '../../components/DiffSummary/DiffSummary';
import { useDiff } from '../../hooks/useDiff.hook';
import styles from './CompareView.module.scss';
import type { CompareMode, CompareViewProps } from './CompareView.type';

const MODES: { value: CompareMode; label: string }[] = [
  { value: 'changes', label: 'Các thay đổi' },
  { value: 'side', label: 'Xem song song' },
];

export function CompareView({ mode, onModeChange }: CompareViewProps) {
  const d = useDiff();

  if (d.changes.length === 0) {
    return <p className={styles.empty}>Bản nháp chưa khác gì lịch gốc. Quay lại để kéo thả hoặc sửa khối.</p>;
  }

  const touchedDays = TRIP_DAYS.filter((day) => d.dayHasChanges(day.value));

  return (
    <div className={styles.view}>
      <SegmentedControl options={MODES} value={mode} onChange={onModeChange} ariaLabel="Cách xem" variant="track" />
      <DiffSummary title={d.title} breakdown={d.breakdown} before={d.before} after={d.after} />

      {mode === 'changes' ? (
        d.changes.map((c) => <ChangeItem key={`${c.kind}-${c.blockId}`} change={c} />)
      ) : (
        touchedDays.map((day) => {
          const before = blocksOfDay(d.base, day.value);
          const after = blocksOfDay(d.blocks, day.value);
          return (
            <section key={day.value} className={styles.side} aria-label={day.label}>
              <h2 className={styles.dayTitle}>{day.label}</h2>
              <div className={styles.columns}>
                <div className={styles.column}>
                  <span className={styles.colHead}>Lịch gốc</span>
                  {before.map((b) => (
                    <span key={b.id} className={cx(styles.line, d.kindById.get(b.id) && styles.lineOld)}>
                      <span className={styles.time}>{b.time}</span>{b.title}
                    </span>
                  ))}
                </div>
                <div className={styles.column}>
                  <span className={styles.colHead}>Bản nháp</span>
                  {after.map((b) => (
                    <span key={b.id} className={cx(styles.line, d.kindById.get(b.id) && styles.lineNew)}>
                      <span className={styles.time}>{b.time}</span>{b.title}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
