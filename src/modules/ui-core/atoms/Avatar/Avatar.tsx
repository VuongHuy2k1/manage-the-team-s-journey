import { cx } from '../../utils/classNames.utils';
import styles from './Avatar.module.scss';
import type { AvatarProps } from './Avatar.type';

/** Chữ cái đầu của tên (từ cuối), bỏ phần trong ngoặc: "Nhân Nguyễn (trưởng)" → "N" */
export function avatarInitial(name: string): string {
  const words = name.replace(/\(.*?\)/g, ' ').match(/[\p{L}\p{N}]+/gu) ?? [];
  const last = words[words.length - 1];
  if (!last) return '?';
  return /^\d+$/.test(last) ? last : last[0].toUpperCase();
}

export function Avatar({ name, color, src, size = 32, ring = false, selected = false }: AvatarProps) {
  return (
    <span
      className={cx(styles.avatar, ring && styles.ring, selected && styles.selected)}
      style={{ width: size, height: size, background: color, fontSize: Math.round(size * 0.4) }}
      title={name}
      aria-hidden="true"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className={styles.img} referrerPolicy="no-referrer" />
      ) : (
        avatarInitial(name)
      )}
    </span>
  );
}
