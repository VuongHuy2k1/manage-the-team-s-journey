import { cx } from '../../utils/classNames.utils';
import styles from './DayTabs.module.scss';
import type { DayTabsProps } from './DayTabs.type';

export function DayTabs({ options, value, onChange, tone = 'onBrand' }: DayTabsProps) {
  return (
    <div className={cx(styles.tabs, styles[tone])} role="tablist" aria-label="Chọn ngày">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          className={cx(styles.tab, o.value === value && styles.on)}
          onClick={() => onChange(o.value)}
        >
          {o.label}
          {o.dot && <span className={styles.dot} aria-label="có thay đổi" />}
        </button>
      ))}
    </div>
  );
}
