'use client';

import { useState } from 'react';
import { ROUTES } from '@/core/config/routes.config';
import { dayLabel, estimateGroup, estimatePerPerson } from '@/modules/schedule/utils/schedule.utils';
import type { Block } from '@/modules/schedule/schedule.type';
import { AppHeader, MoneyText } from '@/modules/ui-core';
import { EstimateRow } from '../../components/EstimateRow/EstimateRow';
import { BlockCostSheet } from '../../functions/BlockCostSheet/BlockCostSheet';
import { PlannedCostList } from '../../functions/PlannedCostList/PlannedCostList';
import { useEstimate } from '../../hooks/useEstimate.hook';
import styles from './EstimateScreen.module.scss';

/** Bảng dự tính chi phí tổng hợp cho cả nhóm xem */
export function EstimateScreen() {
  const e = useEstimate();
  const s = e.summary;
  const [editing, setEditing] = useState<Block | null>(null);
  return (
    <>
      <AppHeader variant="plain" backHref={ROUTES.fund} title="Bảng dự tính chi phí" eyebrow={`Cả nhóm ${s.memberCount} người`} />
      <main className={styles.main}>
        <section className={styles.total} aria-label="Tổng dự tính">
          <span className={styles.totalLabel}>Tổng dự tính cả chuyến</span>
          <MoneyText value={s.totalEstimate} size={28} />
          <span className={styles.totalPer}>
            ≈ <MoneyText value={s.perPerson.estimate} weight={700} /> mỗi người
          </span>
          <div className={styles.split}>
            <div><span>Lịch trình</span><MoneyText value={s.totalEstimate - s.plannedEstimate} format="k" /></div>
            <div><span>Khoản thêm</span><MoneyText value={s.plannedEstimate} format="k" /></div>
            <div><span>Còn phải chi</span><MoneyText value={s.remainingEstimate} format="k" /></div>
          </div>
        </section>

        <PlannedCostList estimate={e} />

        {e.days.map((d) => (
          <section key={d.day} className={styles.day} aria-label={dayLabel(d.day)}>
            <div className={styles.dayHead}>
              <h2 className={styles.dayTitle}>{dayLabel(d.day)}</h2>
              <span className={styles.daySum}>
                <MoneyText value={d.total} weight={700} /> · <MoneyText value={d.perPerson} format="k" weight={500} />/người
              </span>
            </div>
            <ul className={styles.list}>
              {d.blocks.map((b) => {
                const c = e.completions[b.id];
                return (
                  <li key={b.id}>
                    <EstimateRow
                      title={b.title}
                      meta={b.time || undefined}
                      total={estimateGroup(b, e.memberCount)}
                      perPerson={estimatePerPerson(b, e.memberCount)}
                      costLabel={b.costLabel}
                      done={Boolean(c)}
                      actual={c?.actualTotal}
                      onClick={e.isLeader ? () => setEditing(b) : undefined}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        <p className={styles.foot}>
          {e.isLeader
            ? 'Bấm vào một mục để sửa tên, chi phí hoặc xoá. Thay đổi được ghi vào lịch sử thay đổi lịch trình.'
            : 'Muốn đổi giá trong lịch trình: sửa ở bản nháp rồi gửi nhóm trưởng duyệt.'}
        </p>
        <BlockCostSheet
          open={Boolean(editing)}
          onClose={() => setEditing(null)}
          block={editing}
          memberCount={e.memberCount}
          onSave={(input) => (editing ? e.editBlock(editing.id, input) : Promise.resolve(false))}
          onDelete={() => (editing ? e.removeBlock(editing.id) : Promise.resolve(false))}
          completed={Boolean(editing && e.completions[editing.id])}
        />
      </main>
    </>
  );
}
