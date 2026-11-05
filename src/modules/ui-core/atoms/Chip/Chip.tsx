import { cx } from '../../utils/classNames.utils';
import styles from './Chip.module.scss';
import type { ChipProps } from './Chip.type';

export function Chip({ tone = 'neutral', children }: ChipProps) {
  return <span className={cx(styles.chip, styles[tone])}>{children}</span>;
}
