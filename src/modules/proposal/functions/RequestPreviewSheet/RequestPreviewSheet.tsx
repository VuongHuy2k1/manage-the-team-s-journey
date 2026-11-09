'use client';

import { useEffect, useState } from 'react';
import { dayLabel, costText } from '@/modules/schedule/utils/schedule.utils';
import type { DayNumber } from '@/modules/schedule/schedule.type';
import { Badge, BottomSheet, MoneyText, SegmentedControl, cx } from '@/modules/ui-core';
import { ChangeItem } from '../../components/ChangeItem/ChangeItem';
import { useRequestPreview } from '../../hooks/useRequestPreview.hook';
import { CHANGE_LABEL } from '../../utils/diff.utils';
import styles from './RequestPreviewSheet.module.scss';
import type { RequestPreviewSheetProps } from './RequestPreviewSheet.type';

type ViewMode = 'changes' | 'after' | 'before';

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: 'changes', label: 'Thay đổi' },
  { value: 'after', label: 'Sau khi duyệt' },
  { value: 'before', label: 'Lịch hiện tại' },
];

/** Xem trước toàn bộ lịch trình nếu duyệt yêu cầu */
export function RequestPreviewSheet({ request, onClose, actions }: RequestPreviewSheetProps) {
  const p = useRequestPreview(request);
  const [day, setDay] = useState<DayNumber>(1);
  const [view, setView] = useState<ViewMode>('after');

  // Mở ra thì nhảy tới ngày đầu tiên có thay đổi
  useEffect(() => {
    if (!request || !p) return;
    setView('changes');
    setDay((p.days.find((d) => d.changed) ?? p.days[0])?.day ?? 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.id]);

  const current = p?.days.find((d) => d.day === day);
  const delta = p ? p.perPersonAfter - p.perPersonBefore : 0;

  return (
    <BottomSheet
      open={Boolean(request && p)}
      onClose={onClose}
      label="Xem trước lịch sau khi duyệt"
      header={
        <span className={styles.header}>
          <span className={styles.heading}>{request?.title}</span>
          {p && (
            <span className={styles.sub}>
              Dự tính / người <MoneyText value={p.perPersonBefore} format="k" weight={500} /> →{' '}
              <MoneyText value={p.perPersonAfter} format="k" weight={700} />{' '}
              {delta !== 0 && <span className={delta > 0 ? styles.up : styles.down}>({delta > 0 ? '+' : '−'}{Math.abs(delta / 1000).toLocaleString('vi-VN')}k)</span>}
            </span>
          )}
        </span>
      }
      footer={actions}
    >
      {p && (
        <>
          <SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} ariaLabel="Xem" variant="track" />

          {view === 'changes' && request && (
            <div className={styles.changeList}>
              <span className={styles.count}>{request.changes.length} thay đổi so với lịch hiện tại</span>
              {request.changes.map((c) => (
                <ChangeItem key={`${c.kind}-${c.blockId}`} change={c} />
              ))}
            </div>
          )}

          {view !== 'changes' && (
          <>
          <div className={styles.days} role="tablist" aria-label="Chọn ngày">
            {p.days.map((d) => (
              <button
                key={d.day}
                type="button"
                role="tab"
                aria-selected={d.day === day}
                className={cx(styles.day, d.day === day && styles.dayOn)}
                onClick={() => setDay(d.day)}
              >
                {dayLabel(d.day)}
                {d.changed && <span className={styles.dot} aria-label="có thay đổi" />}
              </button>
            ))}
          </div>

          {current && (
            <ul className={styles.list}>
              {(view === 'after' ? current.after : current.before).map((b) => {
                const kind = p.kindById.get(b.id);
                const show = view === 'after' ? kind : kind && kind !== 'added' ? kind : undefined;
                return (
                  <li key={b.id} className={cx(styles.item, show && styles[show])}>
                    <span className={styles.time}>{b.time || '—'}</span>
                    <span className={styles.text}>
                      <span className={styles.title}>{b.title}</span>
                      {b.address && <span className={styles.meta}>{b.address}</span>}
                    </span>
                    <span className={styles.right}>
                      {show && <Badge kind={show}>{view === 'before' && show !== 'deleted' ? 'Sẽ đổi' : CHANGE_LABEL[show]}</Badge>}
                      <span className={styles.cost}>{costText(b, p.memberCount)}</span>
                    </span>
                  </li>
                );
              })}
              {view === 'after' &&
                current.removed.map((b) => (
                  <li key={`rm-${b.id}`} className={cx(styles.item, styles.deleted)}>
                    <span className={styles.time}>{b.time || '—'}</span>
                    <span className={styles.text}>
                      <span className={cx(styles.title, styles.strike)}>{b.title}</span>
                      <span className={styles.meta}>Bị bỏ khỏi lịch</span>
                    </span>
                    <span className={styles.right}>
                      <Badge kind="deleted">{CHANGE_LABEL.deleted}</Badge>
                    </span>
                  </li>
                ))}
              {(view === 'after' ? current.after : current.before).length === 0 && current.removed.length === 0 && (
                <li className={styles.empty}>Ngày này chưa có mốc nào.</li>
              )}
            </ul>
          )}
          </>
          )}
          {request?.reason && <p className={styles.reason}>“{request.reason}”</p>}
        </>
      )}
    </BottomSheet>
  );
}
