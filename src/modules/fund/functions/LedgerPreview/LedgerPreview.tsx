'use client';

import { ROUTES } from '@/core/config/routes.config';
import { formatWhen } from '@/core/utils/time.utils';
import { memberName, shortName } from '@/modules/member/utils/role.utils';
import { Button } from '@/modules/ui-core';
import { LedgerRow } from '../../components/LedgerRow/LedgerRow';
import { useLedger } from '../../hooks/useLedger.hook';
import styles from './LedgerPreview.module.scss';
import type { LedgerPreviewProps } from './LedgerPreview.type';

/** Vài dòng cộng / trừ quỹ gần nhất */
export function LedgerPreview({ limit = 5 }: LedgerPreviewProps) {
  const l = useLedger();
  const latest = l.entries.slice(0, limit);
  return (
    <section className={styles.card} aria-label="Lịch sử quỹ">
      <div className={styles.head}>
        <span className={styles.title}>Lịch sử quỹ</span>
        {l.entries.length > 0 && <Button size="sm" href={ROUTES.fundHistory}>Xem tất cả ({l.entries.length})</Button>}
      </div>
      {latest.length === 0 ? (
        <p className={styles.empty}>Mỗi lần nộp quỹ, trừ chi phí, chi ngoài lịch hay sửa số dư đều được ghi lại ở đây.</p>
      ) : (
        <ul className={styles.list}>
          {latest.map((entry) => (
            <li key={entry.id}>
              <LedgerRow entry={entry} byName={shortName(memberName(l.membersById, entry.by))} when={formatWhen(entry.at)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
