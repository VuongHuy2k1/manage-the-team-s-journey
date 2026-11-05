import { Avatar, cx } from '@/modules/ui-core';
import { RoleTag } from '../RoleTag/RoleTag';
import styles from './MemberRow.module.scss';
import type { MemberRowProps } from './MemberRow.type';

export function MemberRow({ member, isLeader, isMe, meta, action, muted }: MemberRowProps) {
  return (
    <div className={cx(styles.row, muted && styles.muted)}>
      <Avatar name={member.name} color={member.color} src={member.avatar} size={40} />
      <div className={styles.text}>
        <span className={styles.nameRow}>
          <span className={styles.name}>{member.name}</span>
          {isMe && <span className={styles.me}>Bạn</span>}
          {isLeader && <RoleTag tone="soft" />}
        </span>
        {meta && <span className={styles.meta}>{meta}</span>}
      </div>
      {action}
    </div>
  );
}
