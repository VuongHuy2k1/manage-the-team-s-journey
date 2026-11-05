import { Avatar } from '../../atoms/Avatar/Avatar';
import styles from './AvatarStack.module.scss';
import type { AvatarStackProps } from './AvatarStack.type';

export function AvatarStack({ people, max = 5, size = 24 }: AvatarStackProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span className={styles.stack} aria-label={people.map((p) => p.name).join(', ')}>
      {shown.map((p) => (
        <span key={p.id} className={styles.item}>
          <Avatar name={p.name} color={p.color} src={p.avatar} size={size} ring />
        </span>
      ))}
      {extra > 0 && (
        <span className={styles.more} style={{ width: size, height: size }}>
          +{extra}
        </span>
      )}
    </span>
  );
}
