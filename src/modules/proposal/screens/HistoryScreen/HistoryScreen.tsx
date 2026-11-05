'use client';

import Link from 'next/link';
import { MAIN_NAV } from '@/core/config/nav.config';
import { ROUTES } from '@/core/config/routes.config';
import { AccountMenu } from '@/modules/member';
import { AppHeader, BottomNav } from '@/modules/ui-core';
import { HistoryTimeline } from '../../functions/HistoryTimeline/HistoryTimeline';
import { useHistory } from '../../hooks/useHistory.hook';
import { useRequests } from '../../hooks/useRequests.hook';
import styles from './HistoryScreen.module.scss';

export function HistoryScreen() {
  const { total } = useHistory();
  const { pending } = useRequests();

  return (
    <>
      <AppHeader title="Yêu cầu đổi lịch" aside={<AccountMenu />}>
        <nav className={styles.tabs} aria-label="Yêu cầu">
          <Link href={ROUTES.requests} className={styles.tab}>Chờ duyệt ({pending.length})</Link>
          <span className={styles.tabOn} aria-current="page">Lịch sử ({total})</span>
        </nav>
      </AppHeader>
      <main className={styles.main}>
        <HistoryTimeline />
      </main>
      <BottomNav items={MAIN_NAV.map((i) => (i.key === 'requests' ? { ...i, badge: pending.length } : i))} activeKey="requests" />
    </>
  );
}
