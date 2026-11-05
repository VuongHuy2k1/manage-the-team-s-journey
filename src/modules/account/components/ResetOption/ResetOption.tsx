import styles from './ResetOption.module.scss';
import type { ResetOptionProps } from './ResetOption.type';

export function ResetOption({ id, title, description, count, checked, onChange, disabled }: ResetOptionProps) {
  return (
    <label className={styles.option} htmlFor={id} data-checked={checked || undefined}>
      <input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className={styles.text}>
        <span className={styles.title}>
          {title}
          {count && <span className={styles.count}>{count}</span>}
        </span>
        <span className={styles.desc}>{description}</span>
      </span>
    </label>
  );
}
