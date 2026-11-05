'use client';

import { ROUTES } from '@/core/config/routes.config';
import { formatWhen } from '@/core/utils/time.utils';
import { memberName, shortName } from '@/modules/member/utils/role.utils';
import { AppHeader, MoneyText, SegmentedControl } from '@/modules/ui-core';
import { LedgerRow } from '../../components/LedgerRow/LedgerRow';
import { useLedger, type LedgerFilter } from '../../hooks/useLedger.hook';
import styles from './FundHistoryScreen.module.scss';

const FILTERS: { value: LedgerFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'in', label: 'Tiền vào' },
  { value: 'out', label: 'Tiền ra' },
];

export function FundHistoryScreen() {
  const l = useLedger();
  return (
    <>
      <AppHeader variant="plain" backHref={ROUTES.fund} title="Lịch sử quỹ" eyebrow={`${l.entries.length} lần cộng / trừ`} />
      <main className={styles.main}>
        <div className={styles.summary}>
          <div className={styles.cell}><span>Tiền vào</span><MoneyText value={l.totalIn} tone="success" /></div>
          <div className={styles.cell}><span>Tiền ra</span><MoneyText value={l.totalOut} tone="danger" /></div>
          <div className={styles.cell}><span>Số dư</span><MoneyText value={l.balance} /></div>
        </div>
        <SegmentedControl options={FILTERS} value={l.filter} onChange={l.setFilter} ariaLabel="Lọc lịch sử quỹ" variant="track" />
        {l.groups.length === 0 ? (
          <p className={styles.empty}>Chưa có dòng nào.</p>
        ) : (
          l.groups.map((g) => (
            <section key={g.day} className={styles.group} aria-label={g.day}>
              <h2 className={styles.day}>{g.day}</h2>
              <ul className={styles.list}>
                {g.items.map((entry) => (
                  <li key={entry.id}>
                    <LedgerRow entry={entry} byName={shortName(memberName(l.membersById, entry.by))} when={formatWhen(entry.at)} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </main>
    </>
  );
}
