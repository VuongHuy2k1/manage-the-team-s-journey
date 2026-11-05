import { Chip, cx } from '@/modules/ui-core';
import { CATEGORY_LABEL, costText } from '../../utils/schedule.utils';
import styles from './ScheduleBlock.module.scss';
import type { ScheduleBlockProps } from './ScheduleBlock.type';

export function ScheduleBlock({ block, memberCount, leading, trailing, badge, oldTime, tone = 'default', status, onSelect }: ScheduleBlockProps) {
  const cost = costText(block, memberCount);
  const noPrice = !block.estimate && !block.costLabel;
  const body = (
    <>
      <span className={styles.meta}>
        {block.time && <span className={styles.time}>{block.time}</span>}
        {oldTime && <span className={styles.oldTime}>{oldTime}</span>}
        <Chip tone={block.category}>{CATEGORY_LABEL[block.category]}</Chip>
        <span className={cx(styles.cost, noPrice && styles.noPrice)}>{cost}</span>
      </span>
      <span className={styles.title}>{block.title}</span>
      {block.address && <span className={styles.address}>{block.address}</span>}
      {status && <span className={styles.status}>{status}</span>}
    </>
  );

  return (
    <div className={cx(styles.block, styles[tone])}>
      {leading}
      {onSelect ? (
        <button type="button" className={cx(styles.body, styles.clickable)} onClick={onSelect}>
          {body}
        </button>
      ) : (
        <div className={styles.body}>{body}</div>
      )}
      {badge && <span className={styles.badge}>{badge}</span>}
      {trailing}
    </div>
  );
}
