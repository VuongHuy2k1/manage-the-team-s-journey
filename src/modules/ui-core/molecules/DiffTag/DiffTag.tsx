import { cx } from '../../utils/classNames.utils';
import { formatSignedK } from '../../utils/money.utils';
import styles from './DiffTag.module.scss';
import type { DiffTagProps } from './DiffTag.type';

export function DiffTag({ diff }: DiffTagProps) {
  const tone = diff > 0 ? styles.over : diff < 0 ? styles.under : styles.even;
  return <span className={cx(styles.tag, tone)}>{diff === 0 ? 'Khớp' : formatSignedK(diff)}</span>;
}
