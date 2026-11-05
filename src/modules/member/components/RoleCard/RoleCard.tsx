import { Icon } from '@/modules/ui-core';
import styles from './RoleCard.module.scss';
import type { RoleCardProps } from './RoleCard.type';

export function RoleCard({ icon, title, description, onClick, tag }: RoleCardProps) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <span className={styles.icon}>
        <Icon name={icon} size={26} />
      </span>
      <span className={styles.text}>
        <span className={styles.titleRow}>
          <span className={styles.title}>{title}</span>
          {tag && <span className={styles.tag}>{tag}</span>}
        </span>
        <span className={styles.desc}>{description}</span>
      </span>
      <Icon name="arrow-right" size={20} className={styles.arrow} />
    </button>
  );
}
