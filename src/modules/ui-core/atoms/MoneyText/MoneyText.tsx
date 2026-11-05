import { formatK, formatVND } from '../../utils/money.utils';
import { cx } from '../../utils/classNames.utils';
import styles from './MoneyText.module.scss';
import type { MoneyTextProps } from './MoneyText.type';

export function MoneyText({ value, format = 'full', signed = false, tone = 'default', size, weight = 600, strike }: MoneyTextProps) {
  const abs = Math.abs(value);
  const body = format === 'k' ? formatK(signed ? abs : value) : formatVND(signed ? abs : value);
  const prefix = signed && value !== 0 ? (value > 0 ? '+' : '−') : '';
  const text = prefix + body;
  return (
    <span className={cx(styles.money, styles[tone], strike && styles.strike)} style={{ fontSize: size, fontWeight: weight }}>
      {text}
    </span>
  );
}
