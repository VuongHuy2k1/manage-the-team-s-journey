'use client';

import { useMemo, useState } from 'react';
import { MAIN_NAV } from '@/core/config/nav.config';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { AccountMenu } from '@/modules/member';
import { AppHeader, BottomNav } from '@/modules/ui-core';
import { GroupMap } from '../../functions/GroupMap/GroupMap';
import { LocationList } from '../../functions/LocationList/LocationList';
import { ShareToggle } from '../../functions/ShareToggle/ShareToggle';
import { useLocations } from '../../hooks/useLocations.hook';
import type { MapPoint } from '../../location.type';
import styles from './LocationScreen.module.scss';

export function LocationScreen() {
  const { rows, sharingCount } = useLocations();
  const { requests } = useTripState();
  const [focusId, setFocusId] = useState<string | null>(null);
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;

  const points = useMemo<MapPoint[]>(
    () =>
      rows
        .filter((r) => r.visible && r.location)
        .map((r) => ({
          id: r.member.id,
          name: r.member.name,
          color: r.member.color,
          avatar: r.member.avatar,
          lat: r.location?.lat as number,
          lng: r.location?.lng as number,
          isMe: r.isMe,
          stale: r.stale,
        })),
    [rows],
  );

  return (
    <>
      <AppHeader title="Vị trí cả nhóm" eyebrow={`${sharingCount}/${rows.length} người đang chia sẻ`} aside={<AccountMenu />}>
        <ShareToggle sharingCount={sharingCount} />
      </AppHeader>
      <main className={styles.main}>
        <GroupMap points={points} focusId={focusId} />
        <LocationList rows={rows} onFocus={setFocusId} />
      </main>
      <BottomNav items={MAIN_NAV.map((i) => (i.key === 'requests' ? { ...i, badge: pendingRequests } : i))} activeKey="location" />
    </>
  );
}
