import { Badge, Icon } from '@/modules/ui-core';
import { CHANGE_LABEL } from '../../utils/diff.utils';
import styles from './ChangeItem.module.scss';
import type { ChangeItemProps } from './ChangeItem.type';

export function ChangeItem({ change, variant = 'card' }: ChangeItemProps) {
  if (variant === 'compact') {
    return (
      <div className={styles.compact}>
        <Badge kind={change.kind}>{CHANGE_LABEL[change.kind]}</Badge>
        <span className={styles.compactText}>
          <b>{change.title}</b> <span className={styles.muted}>{change.kind === 'deleted' ? 'bỏ khỏi lịch' : change.after}</span>
        </span>
      </div>
    );
  }
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.title}>{change.title}</span>
        <Badge kind={change.kind}>{CHANGE_LABEL[change.kind]}</Badge>
      </div>
      <div className={styles.diff}>
        <span className={styles.before}>{change.before}</span>
        <Icon name="arrow-right" size={14} strokeWidth={2.4} className={styles.arrow} />
        <span className={change.kind === 'deleted' ? styles.before : styles.after}>{change.after}</span>
      </div>
    </div>
  );
}
