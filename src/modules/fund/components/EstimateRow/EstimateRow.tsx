import { Icon, MoneyText, cx } from '@/modules/ui-core';
import styles from './EstimateRow.module.scss';
import type { EstimateRowProps } from './EstimateRow.type';

export function EstimateRow({ title, meta, total, perPerson, costLabel, actual, done, onClick }: EstimateRowProps) {
  const body = (
    <>
      <span className={cx(styles.dot, done && styles.done)} aria-hidden="true">
        {done && <Icon name="check" size={12} />}
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {meta && <span className={styles.meta}>{meta}</span>}
      </span>
      <span className={styles.money}>
        {costLabel && !total ? (
          <span className={styles.label}>{costLabel}</span>
        ) : total === null ? (
          <span className={styles.label}>Chưa có giá</span>
        ) : (
          <>
            <MoneyText value={total} size={14} />
            <span className={styles.per}>
              <MoneyText value={perPerson ?? 0} format="k" weight={500} /> / người
            </span>
          </>
        )}
        {done && actual !== undefined && (
          <span className={styles.actual}>
            Thực chi <MoneyText value={actual} format="k" weight={600} />
          </span>
        )}
      </span>
    </>
  );
  if (onClick) {
    return (
      <button type="button" className={cx(styles.row, styles.button)} onClick={onClick} aria-label={`Sửa khoản ${title}`}>
        {body}
      </button>
    );
  }
  return <div className={styles.row}>{body}</div>;
}
