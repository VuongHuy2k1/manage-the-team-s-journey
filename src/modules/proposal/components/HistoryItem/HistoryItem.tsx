import { Badge, cx } from '@/modules/ui-core';
import { ChangeItem } from '../ChangeItem/ChangeItem';
import styles from './HistoryItem.module.scss';
import type { HistoryItemProps, HistoryItemStatus } from './HistoryItem.type';

const STATUS: Record<HistoryItemStatus, { label: string; kind: 'ok' | 'no' | 'new' | 'warn' }> = {
  create: { label: 'Tạo lịch', kind: 'new' },
  approve: { label: 'Đã duyệt', kind: 'ok' },
  restore: { label: 'Khôi phục', kind: 'warn' },
  edit: { label: 'Sửa giá', kind: 'warn' },
  reject: { label: 'Từ chối', kind: 'no' },
};

export function HistoryItem({ status, versionLabel, when, title, proposedByName, decisionText, changes, note, action }: HistoryItemProps) {
  const s = STATUS[status];
  return (
    <>
      <div className={styles.top}>
        <span className={styles.left}>
          {versionLabel && <span className={styles.version}>{versionLabel}</span>}
          <Badge kind={s.kind}>{s.label}</Badge>
        </span>
        <span className={styles.when}>{when}</span>
      </div>
      <div className={cx(styles.card, status === 'reject' && styles.rejected)}>
        <span className={styles.title}>{title}</span>
        <span className={styles.meta}>
          Đề xuất: <b>{proposedByName}</b> · {decisionText}
        </span>
        {changes.length > 0 && (
          <div className={styles.changes}>
            {changes.map((c) => (
              <ChangeItem key={`${c.kind}-${c.blockId}`} change={c} variant="compact" />
            ))}
          </div>
        )}
        {note && <span className={styles.note}>{note}</span>}
        {action}
      </div>
    </>
  );
}
