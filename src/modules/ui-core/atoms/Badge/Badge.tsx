import { cx } from '../../utils/classNames.utils';
import styles from './Badge.module.scss';
import type { BadgeProps } from './Badge.type';

export function Badge({ kind, children }: BadgeProps) {
  return <span className={cx(styles.badge, styles[kind])}>{children}</span>;
}
