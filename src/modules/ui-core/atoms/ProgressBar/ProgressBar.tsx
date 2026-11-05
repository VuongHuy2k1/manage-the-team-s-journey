import styles from './ProgressBar.module.scss';
import type { ProgressBarProps } from './ProgressBar.type';

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function ProgressBar({ value = 0, color = 'var(--c-primary)', segments, height = 8, label }: ProgressBarProps) {
  const parts = segments ?? [{ value, color }];
  return (
    <div
      className={styles.track}
      style={{ height, borderRadius: height / 2 }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {parts.map((p, i) => (
        <span key={i} className={styles.bar} style={{ width: `${clamp(p.value)}%`, background: p.color }} />
      ))}
    </div>
  );
}
