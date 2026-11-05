'use client';

import { MAIN_NAV } from '@/core/config/nav.config';
import { ROUTES } from '@/core/config/routes.config';
import { AccountMenu } from '@/modules/member';
import { AppHeader, BottomNav, MoneyText } from '@/modules/ui-core';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { EstimateVsActual } from '../../components/EstimateVsActual/EstimateVsActual';
import { CompletedList } from '../../functions/CompletedList/CompletedList';
import { useCompleted } from '../../hooks/useCompleted.hook';
import styles from './CompletedScreen.module.scss';

export function CompletedScreen() {
  const data = useCompleted();
  const { requests } = useTripState();
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;

  return (
    <>
      <AppHeader title="Đã hoàn thành" eyebrow={`${data.count} mục · tính mỗi người`} aside={<AccountMenu />}>
        <EstimateVsActual estimate={data.estimate} actual={data.actual} remaining={data.remaining} />
      </AppHeader>
      <main className={styles.main}>
        <div className={styles.chips}>
          <span className={styles.chip}>
            Quỹ còn <MoneyText value={data.fundBalance} format="k" />
          </span>
          {data.pendingCount > 0 && (
            <span className={styles.chipWarn}>{data.pendingCount} mốc chờ nhóm trưởng xác nhận</span>
          )}
        </div>
        <CompletedList emptyHref={ROUTES.schedule} />
      </main>
      <BottomNav items={MAIN_NAV.map((i) => (i.key === 'requests' ? { ...i, badge: pendingRequests } : i))} activeKey="completed" />
    </>
  );
}
