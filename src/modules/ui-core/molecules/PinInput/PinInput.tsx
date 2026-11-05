'use client';

import { cx } from '../../utils/classNames.utils';
import styles from './PinInput.module.scss';
import type { PinInputProps } from './PinInput.type';

/** Ô nhập mã số: bàn phím số trên điện thoại, dán được, tự gửi khi đủ số */
export function PinInput({ id, length = 6, value, onChange, onComplete, invalid, disabled, label, autoFocus }: PinInputProps) {
  return (
    <input
      id={id}
      className={cx(styles.input, invalid && styles.invalid)}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      aria-label={label}
      aria-invalid={invalid || undefined}
      maxLength={length}
      placeholder={'•'.repeat(length)}
      value={value}
      disabled={disabled}
      autoFocus={autoFocus}
      onChange={(e) => {
        const next = e.target.value.replace(/\D/g, '').slice(0, length);
        onChange(next);
        if (next.length === length) onComplete?.(next);
      }}
    />
  );
}
