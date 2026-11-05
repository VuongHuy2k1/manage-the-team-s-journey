'use client';

import { memberName } from '@/modules/member';
import { indexMembers } from '@/modules/member/utils/role.utils';
import { Button, formatK } from '@/modules/ui-core';
import { CompletedItem } from '../../components/CompletedItem/CompletedItem';
import type { CompletedRow } from '../../hooks/useCompleted.hook';
import { useCompleted } from '../../hooks/useCompleted.hook';
import styles from './CompletedList.module.scss';
import type { CompletedListProps } from './CompletedList.type';

export function CompletedList({ emptyHref }: CompletedListProps) {
  const data = useCompleted();
  const byId = indexMembers(data.members);

  const payText = (row: CompletedRow) => {
    const total = formatK(row.completion.actualTotal);
    if (row.completion.payMethod === 'fund') return `Trừ quỹ ${total}`;
    if (row.completion.payMethod === 'advance') return `${memberName(byId, row.completion.paidBy)} ứng ${total}`;
    return 'Ai nấy trả';
  };

  if (data.count === 0) {
    return (
      <div className={styles.empty}>
        <p>Chưa có mốc nào hoàn thành. Tick vòng tròn bên phải mỗi mốc trong lịch trình khi xong.</p>
        <Button href={emptyHref} variant="primary">Xem lịch trình</Button>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {data.groups.map((group) => (
        <section key={group.day} className={styles.group} aria-label={group.label}>
          <h2 className={styles.groupTitle}>{group.label}</h2>
          {group.rows.map((row) => (
            <CompletedItem
              key={row.block.id}
              title={row.block.title}
              meta={[row.block.time, payText(row)].filter(Boolean).join(' · ')}
              actualPerPerson={row.actualPerPerson}
              estimatePerPerson={row.estimatePerPerson}
              diff={row.diff}
              trailing={
                data.isLeader ? (
                  <Button variant="ghost" size="sm" icon="refresh" aria-label={`Hoàn tác ${row.block.title}`} onClick={() => data.undo(row.block.id)} />
                ) : undefined
              }
            />
          ))}
        </section>
      ))}
    </div>
  );
}
