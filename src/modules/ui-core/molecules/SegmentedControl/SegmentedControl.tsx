import { cx } from '../../utils/classNames.utils';
import styles from './SegmentedControl.module.scss';
import type { SegmentedControlProps } from './SegmentedControl.type';

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  variant = 'pills',
  wrap = false,
}: SegmentedControlProps<T>) {
  return (
    <div className={cx(styles.group, styles[variant], wrap && styles.wrap)} role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          className={cx(styles.option, option.value === value && styles.on)}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
