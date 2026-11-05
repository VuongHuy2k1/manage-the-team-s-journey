import { cx } from '@/modules/ui-core';
import styles from './RoleTag.module.scss';
import type { RoleTagProps } from './RoleTag.type';

export function RoleTag({ label = 'Nhóm trưởng', tone = 'accent' }: RoleTagProps) {
  return <span className={cx(styles.tag, styles[tone])}>{label}</span>;
}
