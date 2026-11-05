import styles from './Timeline.module.scss';
import type { TimelineProps } from './Timeline.type';

export function Timeline({ items }: TimelineProps) {
  return (
    <ol className={styles.list}>
      {items.map((item, i) => (
        <li key={item.key} className={styles.item}>
          <div className={styles.rail} aria-hidden="true">
            <span className={styles.dot} style={{ background: item.color }} />
            {i < items.length - 1 && <span className={styles.line} />}
          </div>
          <div className={styles.content}>{item.content}</div>
        </li>
      ))}
    </ol>
  );
}
