'use client';

import { useState } from 'react';
import { formatWhen } from '@/core/utils/time.utils';
import { Button, ConfirmDialog } from '@/modules/ui-core';
import { MemberRow } from '../../components/MemberRow/MemberRow';
import { useMemberManagement } from '../../hooks/useMemberManagement.hook';
import type { Member } from '../../member.type';
import { formatPhone } from '../../utils/phone.utils';
import { CallMemberDialog } from '../CallMemberDialog/CallMemberDialog';
import styles from './MemberList.module.scss';

export function MemberList() {
  const m = useMemberManagement();
  const [calling, setCalling] = useState<Member | null>(null);

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
                  meta={
                    member.phone
                      ? formatPhone(member.phone)
                      : m.isLeader
                        ? member.email || undefined
                        : member.joinedAt
                          ? `Vào nhóm ${formatWhen(member.joinedAt).toLowerCase()}`
                          : undefined
                  }
                  onSelect={member.phone && member.id !== m.meId ? () => setCalling(member) : undefined}
                  action={
                    <span className={styles.actions}>
                      {member.phone && member.id !== m.meId && (
                        <Button variant="success" size="sm" icon="phone" aria-label={`Gọi ${member.name}`} onClick={() => setCalling(member)} />
                      )}
                      {canRemove && (
                        <Button variant="ghost" size="sm" icon="trash" aria-label={`Xoá ${member.name} khỏi nhóm`} disabled={m.busyId === member.id} onClick={() => m.askRemove(member)} className={styles.remove} />
                      )}
                    </span>
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

      <p className={styles.note}>
        Bấm vào người có số điện thoại để gọi. Thêm số của bạn ở Tài khoản → Số điện thoại.
        {!m.isLeader && ' Chỉ nhóm trưởng mới xoá được thành viên.'}
      </p>
      <CallMemberDialog member={calling} onClose={() => setCalling(null)} />

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
