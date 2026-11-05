import { cx } from '../../utils/classNames.utils';
import styles from './Input.module.scss';
import type { InputProps } from './Input.type';

export function Input(props: InputProps) {
  const { mono, invalid, large, className } = props;
  const classes = cx(styles.input, mono && styles.mono, invalid && styles.invalid, large && styles.large, className);

  if (props.multiline) {
    const { multiline: _m, mono: _mo, invalid: _i, large: _l, className: _c, ...rest } = props;
    return <textarea className={cx(classes, styles.textarea)} aria-invalid={invalid || undefined} {...rest} />;
  }
  const { multiline: _m, mono: _mo, invalid: _i, large: _l, className: _c, ...rest } = props;
  return <input className={classes} aria-invalid={invalid || undefined} {...rest} />;
}
