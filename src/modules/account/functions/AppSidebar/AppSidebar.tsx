'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_NAV } from '@/core/config/nav.config';
import { ROUTES } from '@/core/config/routes.config';
import { useSyncMeta, useTripState } from '@/core/hooks/useTripState.hook';
import { TripTitleEdit, useTripInfo } from '@/modules/schedule';
import { Avatar, SideNav } from '@/modules/ui-core';
import styles from './AppSidebar.module.scss';

/** Trang con thuộc mục nào trên thanh bên */
const SECTION_OF: { prefix: string; key: string }[] = [
  { prefix: ROUTES.draft, key: 'schedule' },
  { prefix: ROUTES.compare, key: 'requests' },
  { prefix: ROUTES.history, key: 'requests' },
  { prefix: ROUTES.requests, key: 'requests' },
  { prefix: ROUTES.completed, key: 'completed' },
  { prefix: ROUTES.location, key: 'location' },
  { prefix: ROUTES.fund, key: 'fund' },
  { prefix: ROUTES.fundHistory, key: 'fund' },
  { prefix: ROUTES.estimate, key: 'fund' },
  { prefix: ROUTES.actual, key: 'fund' },
  { prefix: ROUTES.schedule, key: 'schedule' },
];

/** Thanh điều hướng bên trái cho máy tính */
export function AppSidebar() {
  const pathname = usePathname();
  const { me } = useSyncMeta();
  const { requests, members, leaderIds } = useTripState();
  const pending = requests.filter((r) => r.status === 'pending').length;
  const activeKey = SECTION_OF.find((s) => pathname.startsWith(s.prefix))?.key;
  const isLeader = Boolean(me && leaderIds.includes(me.id));
  const trip = useTripInfo();

  return (
    <SideNav
      items={MAIN_NAV.map((i) => (i.key === 'requests' ? { ...i, badge: pending } : i))}
      activeKey={activeKey}
      header={
        <div className={styles.brand}>
          <span className={styles.eyebrow}>Sổ tay hành trình</span>
          <span className={styles.titleRow}>
            <span className={styles.title}>{trip.name}</span>
            <TripTitleEdit />
          </span>
          <span className={styles.sub}>{members.length} người</span>
        </div>
      }
      footer={
        me && (
          <Link href={ROUTES.account} className={styles.me} aria-current={pathname.startsWith(ROUTES.account) ? 'page' : undefined}>
            <Avatar name={me.name} color={me.color} src={me.avatar} size={36} />
            <span className={styles.meText}>
              <b>{me.name}</b>
              <span>{isLeader ? 'Nhóm trưởng' : 'Thành viên'} · Tài khoản</span>
            </span>
          </Link>
        )
      }
    />
  );
}
