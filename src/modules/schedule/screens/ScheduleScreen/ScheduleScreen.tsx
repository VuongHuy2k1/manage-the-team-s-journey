'use client';

import Link from 'next/link';
import { MAIN_NAV } from '@/core/config/nav.config';
import { ROUTES } from '@/core/config/routes.config';
import { TRIP } from '@/core/config/trip.config';
import { AccountMenu, useIsLeader } from '@/modules/member';
import { AppHeader, BottomNav, Button, DayTabs, Icon, MoneyText } from '@/modules/ui-core';
import { DayHeader } from '../../components/DayHeader/DayHeader';
import { ScheduleTemplate } from '../../components/ScheduleTemplate/ScheduleTemplate';
import { ScheduleList } from '../../functions/ScheduleList/ScheduleList';
import { useSchedule } from '../../hooks/useSchedule.hook';
import type { DayNumber } from '../../schedule.type';
import styles from './ScheduleScreen.module.scss';

export function ScheduleScreen() {
  const s = useSchedule();
  const isLeader = useIsLeader();

  return (
    <ScheduleTemplate
      header={
        <AppHeader decorated eyebrow={`Lịch chính thức · v${s.versionNumber} · ${s.memberCount} người`} title={TRIP.name} aside={<AccountMenu />}>
          <div className={styles.headBottom}>
            <p className={styles.summary}>
              Dự tính <MoneyText value={s.tripEstimatePerPerson} format="k" /> / người · Quỹ còn <MoneyText value={s.fundBalance} format="k" />
            </p>
            <DayTabs options={s.days} value={s.day} onChange={(d) => s.setDay(d as Exclude<DayNumber, 0>)} />
          </div>
        </AppHeader>
      }
      notices={
        <>
          {s.pendingRequestCount > 0 && (
            <Link href={ROUTES.requests} className={styles.noticeWarn}>
              <span><b>{s.pendingRequestCount} yêu cầu đổi lịch</b> đang chờ nhóm trưởng</span>
              <span className={styles.noticeAction}>Xem</span>
            </Link>
          )}
          {isLeader && s.pendingCompletionCount > 0 && (
            <div className={styles.noticeWarn}>
              <span><b>{s.pendingCompletionCount} mốc</b> có người báo xong, bấm tick để nhập chi phí</span>
            </div>
          )}
          {s.doneCount > 0 && (
            <Link href={ROUTES.completed} className={styles.noticeDone}>
              <span className={styles.row}><Icon name="check" size={16} strokeWidth={2.6} />{s.doneCount} mốc đã xong trong ngày</span>
              <span>Xem thực tế →</span>
            </Link>
          )}
        </>
      }
      fab={
        <Button href={ROUTES.draft} variant="accent" size="lg" icon="edit">
          {s.hasDraft ? 'Tiếp tục bản nháp' : 'Đề xuất đổi lịch'}
        </Button>
      }
      nav={<BottomNav items={MAIN_NAV.map((i) => (i.key === 'requests' ? { ...i, badge: s.pendingRequestCount } : i))} activeKey="schedule" />}
    >
      <DayHeader title={s.dayMeta.title} totalPerPerson={s.dayEstimatePerPerson} />
      <ScheduleList blocks={s.remaining} memberCount={s.memberCount} pendingIds={s.pendingIds} />
    </ScheduleTemplate>
  );
}
