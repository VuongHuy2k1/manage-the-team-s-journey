import { Icon, cx } from '@/modules/ui-core';
import { ChangeItem } from '../ChangeItem/ChangeItem';
import styles from './RequestCard.module.scss';
import type { RequestCardProps } from './RequestCard.type';

export function RequestCard({ title, authorName, when, costText, reason, changes, votes, conflict, children, highlight, onOpen }: RequestCardProps) {
  return (
    <article className={cx(styles.card, highlight && styles.highlight)}>
      <div
        className={cx(styles.body, onOpen && styles.clickable)}
        onClick={onOpen}
        role={onOpen ? 'button' : undefined}
        tabIndex={onOpen ? 0 : undefined}
        aria-label={onOpen ? `Xem chi tiết ${title}` : undefined}
        onKeyDown={onOpen ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } } : undefined}
      >
      <div className={styles.head}>
        <div className={styles.titles}>
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.meta}>{authorName} gửi · {when}</span>
        </div>
        <span className={styles.cost}>{costText}</span>
      </div>
      {reason && <p className={styles.reason}>“{reason}”</p>}
      <div className={styles.changes}>
        {changes.map((c) => (
          <ChangeItem key={`${c.kind}-${c.blockId}`} change={c} variant="compact" />
        ))}
      </div>
      {onOpen && (
        <span className={styles.more}>
          Xem chi tiết & lịch sau khi đổi <Icon name="arrow-right" size={14} />
        </span>
      )}
      </div>
      {votes && <div className={styles.votes}>{votes}</div>}
      {conflict && (
        <span className={cx(styles.conflict, conflict.hasConflict && styles.conflictBad)}>
          <Icon name={conflict.hasConflict ? 'close' : 'check'} size={14} strokeWidth={2.6} />
          {conflict.hasConflict ? `Trùng với thay đổi khác: ${conflict.titles.join(', ')}` : 'Không trùng với yêu cầu khác'}
        </span>
      )}
      {children}
    </article>
  );
}
