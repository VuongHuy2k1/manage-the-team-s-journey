'use client';

import { formatWhen } from '@/core/utils/time.utils';
import { Button, ConfirmDialog } from '@/modules/ui-core';
import { MemberRow } from '../../components/MemberRow/MemberRow';
import { useMemberManagement } from '../../hooks/useMemberManagement.hook';
import styles from './MemberList.module.scss';

export function MemberList() {
  const m = useMemberManagement();

  return (
    <div className={styles.wrap}>
      <section className={styles.section} aria-label="Đang trong nhóm">
        <h2 className={styles.title}>Đang trong nhóm · {m.members.length} người</h2>
        <ul className={styles.list}>
          {m.members.map((member) => {
            const canRemove = m.isLeader && member.id !== m.meId;
            return (
              <li key={member.id}>
                <MemberRow
                  member={member}
                  isLeader={m.leaderIds.includes(member.id)}
                  isMe={member.id === m.meId}
                  meta={m.isLeader ? member.email || undefined : member.joinedAt ? `Vào nhóm ${formatWhen(member.joinedAt).toLowerCase()}` : undefined}
                  action={
                    canRemove ? (
                      <Button variant="ghost" size="sm" icon="trash" aria-label={`Xoá ${member.name} khỏi nhóm`} disabled={m.busyId === member.id} onClick={() => m.askRemove(member)} className={styles.remove} />
                    ) : undefined
                  }
                />
              </li>
            );
          })}
        </ul>
      </section>

      {m.isLeader && m.removedMembers.length > 0 && (
        <section className={styles.section} aria-label="Đã xoá khỏi nhóm">
          <h2 className={styles.title}>Đã xoá khỏi nhóm</h2>
          <ul className={styles.list}>
            {m.removedMembers.map((member) => (
              <li key={member.id}>
                <MemberRow
                  member={member}
                  isLeader={false}
                  isMe={false}
                  muted
                  meta={`${member.removedBy ? `${m.byId[member.removedBy]?.name ?? 'Nhóm trưởng'} xoá` : 'Đã xoá'}${member.removedAt ? ` ${formatWhen(member.removedAt).toLowerCase()}` : ''}`}
                  action={<Button size="sm" loading={m.busyId === member.id} onClick={() => m.restore(member.id)}>Khôi phục</Button>}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {!m.isLeader && <p className={styles.note}>Chỉ nhóm trưởng mới xoá được thành viên.</p>}

      <ConfirmDialog
        open={Boolean(m.confirming)}
        onClose={m.cancel}
        icon="trash"
        iconTone="warn"
        title={`Xoá ${m.confirming?.name ?? ''} khỏi nhóm?`}
        subtitle="Người này sẽ không vào xem lịch, quỹ và vị trí của nhóm được nữa. Bạn có thể khôi phục lại sau."
        actions={
          <>
            <Button size="lg" onClick={m.cancel}>Huỷ</Button>
            <Button size="lg" variant="danger" onClick={m.confirmRemove} loadingText="Đang xoá…">Xoá khỏi nhóm</Button>
          </>
        }
      />
    </div>
  );
}
