'use client';

import { ROUTES } from '@/core/config/routes.config';
import { AppHeader } from '@/modules/ui-core';
import { MemberList } from '../../functions/MemberList/MemberList';
import { useIsLeader } from '../../hooks/useIsLeader.hook';
import styles from './MembersScreen.module.scss';

export function MembersScreen() {
  const isLeader = useIsLeader();
  return (
    <>
      <AppHeader variant="plain" backHref={ROUTES.account} title="Thành viên trong nhóm" eyebrow={isLeader ? 'Bạn là nhóm trưởng: có thể xoá thành viên' : undefined} />
      <main className={styles.main}>
        <MemberList />
      </main>
    </>
  );
}
