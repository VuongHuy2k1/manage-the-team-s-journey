'use client';

import { useState } from 'react';
import { formatWhen } from '@/core/utils/time.utils';
import { memberName } from '@/modules/member/utils/role.utils';
import { Button, ConfirmDialog, MoneyText, useDisclosure } from '@/modules/ui-core';
import { ExpenseRow } from '../../components/ExpenseRow/ExpenseRow';
import type { ExtraExpense } from '../../fund.type';
import { useExpenses } from '../../hooks/useExpenses.hook';
import { AddExpenseSheet } from '../AddExpenseSheet/AddExpenseSheet';
import styles from './ExpenseList.module.scss';

/** Các khoản chi không nằm trong lịch trình */
export function ExpenseList() {
  const e = useExpenses();
  const sheet = useDisclosure();
  const [deleting, setDeleting] = useState<ExtraExpense | null>(null);

  const payText = (x: ExtraExpense) =>
    x.payMethod === 'fund' ? 'Trừ quỹ' : x.payMethod === 'advance' ? `${memberName(e.membersById, x.paidBy)} ứng` : 'Ai nấy trả';

  return (
    <section className={styles.card} aria-label="Chi ngoài lịch trình">
      <div className={styles.head}>
        <div className={styles.titles}>
          <span className={styles.title}>Chi ngoài lịch trình</span>
          <span className={styles.sub}>{e.expenses.length} khoản · <MoneyText value={e.total} weight={600} /></span>
        </div>
        {e.isLeader && <Button size="sm" variant="primary" icon="plus" onClick={sheet.open}>Thêm khoản chi</Button>}
      </div>

      {e.expenses.length === 0 ? (
        <p className={styles.empty}>Chưa có khoản nào. Tiền nước, thuốc, gửi xe… phát sinh ngoài lịch thì ghi ở đây.</p>
      ) : (
        <ul className={styles.list}>
          {e.expenses.map((x) => (
            <li key={x.id}>
              <ExpenseRow
                title={x.title}
                meta={`${payText(x)} · ${formatWhen(x.at)}`}
                amount={x.amount}
                perPerson={Math.round(x.amount / Math.max(1, e.memberCount))}
                note={x.note}
                action={e.isLeader ? <Button variant="ghost" size="sm" icon="trash" aria-label={`Xoá khoản ${x.title}`} onClick={() => setDeleting(x)} className={styles.del} /> : undefined}
              />
            </li>
          ))}
        </ul>
      )}

      <AddExpenseSheet open={sheet.isOpen} onClose={sheet.close} onAdd={e.add} members={e.members} meId={e.meId} fundBalance={e.fundBalance} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        icon="trash"
        iconTone="warn"
        title={`Xoá khoản “${deleting?.title ?? ''}”?`}
        subtitle={deleting?.payMethod === 'fund' ? 'Số tiền sẽ được cộng lại vào quỹ và ghi vào lịch sử.' : 'Khoản chi sẽ bị xoá khỏi tổng chi phí.'}
        actions={
          <>
            <Button size="lg" onClick={() => setDeleting(null)}>Huỷ</Button>
            <Button size="lg" variant="danger" onClick={async () => { if (deleting) await e.remove(deleting.id); setDeleting(null); }} loadingText="Đang xoá…">Xoá</Button>
          </>
        }
      />
    </section>
  );
}
