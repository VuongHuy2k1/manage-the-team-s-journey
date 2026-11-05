import styles from './ScheduleTemplate.module.scss';
import type { ScheduleTemplateProps } from './ScheduleTemplate.type';

export function ScheduleTemplate({ header, notices, children, fab, nav }: ScheduleTemplateProps) {
  return (
    <>
      {header}
      <main className={styles.main}>
        {notices && <div className={styles.notices}>{notices}</div>}
        {children}
      </main>
      {fab && <div className={styles.fab}>{fab}</div>}
      {nav}
    </>
  );
}
