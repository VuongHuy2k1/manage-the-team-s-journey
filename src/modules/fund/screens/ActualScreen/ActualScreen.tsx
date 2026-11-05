'use client';

import { ROUTES } from '@/core/config/routes.config';
import { formatWhen } from '@/core/utils/time.utils';
import { memberName } from '@/modules/member/utils/role.utils';
import { dayLabel } from '@/modules/schedule/utils/schedule.utils';
import { AppHeader, Button, DiffTag, MoneyText, StatRow, formatK } from '@/modules/ui-core';
import { ActualRow } from '../../components/ActualRow/ActualRow';
import { PayerRow } from '../../components/PayerRow/PayerRow';
import { useActual } from '../../hooks/useActual.hook';
import styles from './ActualScreen.module.scss';

/** Tổng kết chi phí thực tế cho cả nhóm xem */
export function ActualScreen() {
  const a = useActual();
  const per = (v: number) => Math.round(v / a.memberCount);
  const payText = (method: string, paidBy?: string) =>
    method === 'fund' ? 'Trừ quỹ' : method === 'advance' ? `${memberName(a.membersById, paidBy)} ứng` : 'Ai nấy trả';

  return (
    <>
      <AppHeader variant="plain" backHref={ROUTES.fund} title="Tổng kết thực chi" eyebrow={`${a.count} khoản · cả nhóm ${a.memberCount} người`} />
      <main className={styles.main}>
        <section className={styles.total} aria-label="Tổng thực chi">
          <span className={styles.totalLabel}>Đã chi thực tế</span>
          <MoneyText value={a.total} size={28} />
          <span className={styles.totalPer}>
            ≈ <MoneyText value={a.perPerson} weight={700} /> mỗi người
          </span>
          <div className={styles.split}>
            <div><span>Lịch trình</span><MoneyText value={a.scheduleTotal} format="k" /></div>
            <div><span>Ngoài lịch</span><MoneyText value={a.extraTotal} format="k" /></div>
            <div><span>Quỹ còn</span><MoneyText value={a.fundBalance} format="k" tone={a.fundBalance < 0 ? 'danger' : 'default'} /></div>
          </div>
          {a.comparedEstimate > 0 && (
            <div className={styles.compare}>
              <span>So với dự tính các mục đã chi ({formatK(a.comparedEstimate)})</span>
              <DiffTag diff={a.comparedDiff} />
            </div>
          )}
        </section>

        {a.count === 0 ? (
          <section className={styles.card}>
            <p className={styles.empty}>Chưa có khoản nào được chi. Khi nhóm trưởng xác nhận mốc hoàn thành hoặc ghi khoản chi, tổng kết sẽ hiện ở đây.</p>
            <Button href={ROUTES.estimate} block>Xem bảng dự tính</Button>
          </section>
        ) : (
          <>
            <section className={styles.card} aria-label="Theo cách trả">
              <h2 className={styles.cardTitle}>Theo cách trả</h2>
              <StatRow label="Trừ quỹ chung" value={<MoneyText value={a.byMethod.fund} />} />
              <StatRow label="Có người ứng trước" value={<MoneyText value={a.byMethod.advance} />} />
              <StatRow label="Ai nấy tự trả" value={<MoneyText value={a.byMethod.self} />} />
            </section>

            {a.payers.length > 0 && (
              <section className={styles.card} aria-label="Ai đã ứng trước">
                <h2 className={styles.cardTitle}>Ai đã ứng trước</h2>
                <ul className={styles.list}>
                  {a.payers.map((p) => (
                    <li key={p.memberId}>
                      <PayerRow name={p.member?.name ?? 'Ai đó'} color={p.member?.color} avatar={p.member?.avatar} total={p.total} count={p.count} />
                    </li>
                  ))}
                </ul>
                <p className={styles.hint}>Số tiền này nhóm cần hoàn lại cho người đã ứng.</p>
              </section>
            )}

            {a.expenses.length > 0 && (
              <section className={styles.card} aria-label="Chi ngoài lịch trình">
                <div className={styles.cardHead}>
                  <h2 className={styles.cardTitle}>Chi ngoài lịch trình</h2>
                  <span className={styles.cardSum}><MoneyText value={a.extraTotal} weight={700} /></span>
                </div>
                <ul className={styles.list}>
                  {a.expenses.map(({ expense, estimate }) => (
                    <li key={expense.id}>
                      <ActualRow
                        title={expense.title}
                        meta={`${payText(expense.payMethod, expense.paidBy)} · ${formatWhen(expense.at)}`}
                        actual={expense.amount}
                        perPerson={per(expense.amount)}
                        estimate={estimate}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {a.days.map((d) => (
              <section key={d.day} className={styles.card} aria-label={dayLabel(d.day)}>
                <div className={styles.cardHead}>
                  <h2 className={styles.cardTitle}>{dayLabel(d.day)}</h2>
                  <span className={styles.cardSum}>
                    <MoneyText value={d.total} weight={700} /> <DiffTag diff={d.total - d.estimate} />
                  </span>
                </div>
                <ul className={styles.list}>
                  {d.rows.map((r) => (
                    <li key={r.block.id}>
                      <ActualRow
                        title={r.block.title}
                        meta={[r.block.time, payText(r.completion.payMethod, r.completion.paidBy)].filter(Boolean).join(' · ')}
                        actual={r.completion.actualTotal}
                        perPerson={per(r.completion.actualTotal)}
                        estimate={r.estimate}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}
      </main>
    </>
  );
}
