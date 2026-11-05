import { Icon, MoneyText, ProgressBar, cx } from '@/modules/ui-core';
import styles from './RoundHeader.module.scss';
import type { RoundHeaderProps } from './RoundHeader.type';

export function RoundHeader({ title, amount, paidCount, total, collected, expected, note, expanded, onToggle }: RoundHeaderProps) {
  const done = total > 0 && paidCount === total;
  return (
    <button type="button" className={styles.head} onClick={onToggle} aria-expanded={expanded}>
      <span className={styles.top}>
        <span className={styles.title}>{title}</span>
        <span className={cx(styles.count, done && styles.done)}>{paidCount}/{total} đã nộp</span>
        <Icon name="back" size={16} className={cx(styles.chevron, expanded && styles.open)} />
      </span>
      <span className={styles.meta}>
        <MoneyText value={amount} weight={600} /> / người · đã thu <MoneyText value={collected} weight={600} /> / <MoneyText value={expected} weight={500} tone="muted" />
      </span>
      {note && <span className={styles.note}>{note}</span>}
      <ProgressBar value={expected ? (collected / expected) * 100 : 0} color={done ? 'var(--c-success)' : 'var(--c-primary)'} height={6} />
    </button>
  );
}
