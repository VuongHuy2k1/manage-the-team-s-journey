import { Avatar, Icon, cx } from '@/modules/ui-core';
import styles from './LocationRow.module.scss';
import type { LocationRowProps } from './LocationRow.type';

export function LocationRow({ member, isMe, status, stale, visible, directionsUrl, onFocus }: LocationRowProps) {
  const body = (
    <>
      <span className={styles.avatarWrap}>
        <Avatar name={member.name} color={member.color} src={member.avatar} size={38} />
        <span className={cx(styles.dot, visible && !stale && styles.live, visible && stale && styles.stale)} aria-hidden="true" />
      </span>
      <span className={styles.text}>
        <span className={styles.name}>{member.name}{isMe && <span className={styles.me}> (Bạn)</span>}</span>
        <span className={cx(styles.status, !visible && styles.off)}>{status}</span>
      </span>
    </>
  );
  return (
    <div className={styles.row}>
      {onFocus && visible ? (
        <button type="button" className={styles.main} onClick={onFocus} aria-label={`Xem ${member.name} trên bản đồ`}>
          {body}
        </button>
      ) : (
        <div className={styles.main}>{body}</div>
      )}
      {directionsUrl && (
        <a className={styles.go} href={directionsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Chỉ đường tới ${member.name}`}>
          <Icon name="navigate" size={18} />
        </a>
      )}
    </div>
  );
}
