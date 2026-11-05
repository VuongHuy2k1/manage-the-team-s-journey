'use client';

import { useState } from 'react';
import { Button, ConfirmDialog, MoneyText } from '@/modules/ui-core';
import { EstimateRow } from '../../components/EstimateRow/EstimateRow';
import type { PlannedCost } from '../../fund.type';
import { AddExpenseSheet } from '../AddExpenseSheet/AddExpenseSheet';
import { PlannedCostSheet } from '../PlannedCostSheet/PlannedCostSheet';
import styles from './PlannedCostList.module.scss';
import type { PlannedCostListProps } from './PlannedCostList.type';

/** Khoản dự tính ngoài lịch trình (nhóm trưởng thêm / sửa) */
export function PlannedCostList({ estimate: e }: PlannedCostListProps) {
  const [editing, setEditing] = useState<PlannedCost | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [paying, setPaying] = useState<PlannedCost | null>(null);
  const [deleting, setDeleting] = useState<PlannedCost | null>(null);

  const openNew = () => {
    setEditing(null);
    setSheetOpen(true);
  };
  const openEdit = (p: PlannedCost) => {
    setEditing(p);
    setSheetOpen(true);
  };

  return (
    <section className={styles.card} aria-label="Khoản thêm ngoài lịch trình">
      <div className={styles.head}>
        <div className={styles.titles}>
          <span className={styles.title}>Khoản thêm ngoài lịch trình</span>
          <span className={styles.sub}>
            {e.planned.length} khoản · <MoneyText value={e.plannedTotal} weight={600} />
          </span>
        </div>
        {e.isLeader && (
          <Button size="sm" variant="primary" icon="plus" onClick={openNew}>
            Thêm khoản
          </Button>
        )}
      </div>

      {e.planned.length === 0 ? (
        <p className={styles.empty}>
          {e.isLeader ? 'Thêm tiền nhà, xe khứ hồi, đồ dùng chung… để tổng dự tính đầy đủ.' : 'Nhóm trưởng chưa thêm khoản nào.'}
        </p>
      ) : (
        <ul className={styles.list}>
          {e.planned.map((p) => {
            const paid = p.expenseId ? e.expensesById[p.expenseId] : undefined;
            return (
              <li key={p.id} className={styles.item}>
                <EstimateRow
                  title={p.title}
                  meta={p.note}
                  total={p.amount}
                  perPerson={Math.round(p.amount / e.memberCount)}
                  done={Boolean(paid)}
                  actual={paid?.amount}
                  onClick={e.isLeader ? () => openEdit(p) : undefined}
                />
                {e.isLeader && !paid && (
                  <Button size="sm" icon="check" onClick={() => setPaying(p)} className={styles.pay}>
                    Ghi đã chi
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <PlannedCostSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        item={editing}
        memberCount={e.memberCount}
        onSave={(input) => (editing ? e.updatePlanned(editing.id, input) : e.addPlanned(input))}
        onDelete={editing ? () => { setSheetOpen(false); setDeleting(editing); } : undefined}
      />
      <AddExpenseSheet
        open={Boolean(paying)}
        onClose={() => setPaying(null)}
        onAdd={e.payPlanned}
        members={e.members}
        meId={e.meId}
        fundBalance={e.fundBalance}
        initial={paying ? { title: paying.title, amount: paying.amount, plannedId: paying.id } : undefined}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        icon="trash"
        iconTone="warn"
        title={`Xoá khoản “${deleting?.title ?? ''}”?`}
        subtitle="Khoản này sẽ bị bỏ khỏi tổng dự tính. Khoản chi thật đã ghi (nếu có) vẫn giữ nguyên."
        actions={
          <>
            <Button size="lg" onClick={() => setDeleting(null)}>Huỷ</Button>
            <Button size="lg" variant="danger" onClick={async () => { if (deleting) await e.deletePlanned(deleting.id); setDeleting(null); }} loadingText="Đang xoá…">Xoá</Button>
          </>
        }
      />
    </section>
  );
}
