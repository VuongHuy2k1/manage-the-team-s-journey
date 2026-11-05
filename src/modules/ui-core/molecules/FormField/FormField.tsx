import styles from './FormField.module.scss';
import type { FormFieldProps } from './FormField.type';

export function FormField({ label, htmlFor, hint, error, aside, children }: FormFieldProps) {
  const LabelTag = htmlFor ? 'label' : 'span';
  return (
    <div className={styles.field}>
      <div className={styles.head}>
        <LabelTag className={styles.label} htmlFor={htmlFor}>
          {label}
        </LabelTag>
        {aside}
      </div>
      {children}
      {error ? <span className={styles.error} role="alert">{error}</span> : hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
