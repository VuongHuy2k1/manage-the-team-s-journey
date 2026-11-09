'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MAIN_NAV } from '@/core/config/nav.config';
import { ROUTES } from '@/core/config/routes.config';
import { timeAgo } from '@/core/utils/time.utils';
import { AccountMenu, memberName, RoleTag, useIsLeader } from '@/modules/member';
import { AppHeader, BottomNav, Button } from '@/modules/ui-core';
import { RequestCard } from '../../components/RequestCard/RequestCard';
import { ApproveActions } from '../../functions/ApproveActions/ApproveActions';
import { RequestPreviewSheet } from '../../functions/RequestPreviewSheet/RequestPreviewSheet';
import { VotePanel } from '../../functions/VotePanel/VotePanel';
import { useRequests } from '../../hooks/useRequests.hook';
import { costDeltaText } from '../../utils/diff.utils';
import styles from './RequestsScreen.module.scss';

export function RequestsScreen() {
  const { pending, historyCount, membersById } = useRequests();
  const isLeader = useIsLeader();
  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewing = pending.find((v) => v.request.id === previewId)?.request ?? null;

  return (
    <>
      <AppHeader title="Yêu cầu đổi lịch" aside={<span className={styles.aside}>{isLeader && <RoleTag />}<AccountMenu /></span>}>
        <nav className={styles.tabs} aria-label="Yêu cầu">
          <span className={styles.tabOn} aria-current="page">Chờ duyệt ({pending.length})</span>
          <Link href={ROUTES.history} className={styles.tab}>Lịch sử ({historyCount})</Link>
        </nav>
      </AppHeader>

      <main className={styles.main}>
        {pending.length === 0 ? (
          <div className={styles.empty}>
            <p>Không có yêu cầu nào đang chờ. Muốn đổi lịch, tạo bản nháp rồi gửi cho nhóm trưởng.</p>
            <Button href={ROUTES.draft} variant="accent" icon="edit">Đề xuất đổi lịch</Button>
          </div>
        ) : (
          pending.map((view, i) => (
            <RequestCard
              key={view.request.id}
              highlight={i === 0}
              title={view.request.title}
              authorName={memberName(membersById, view.request.authorId)}
              when={timeAgo(view.request.createdAt)}
              costText={costDeltaText(view.request.costDeltaPerPerson)}
              reason={view.request.reason}
              changes={view.request.changes}
              votes={<VotePanel view={view} />}
              conflict={view.conflict}
              onOpen={() => setPreviewId(view.request.id)}
            >
              <ApproveActions requestId={view.request.id} title={view.request.title} />
            </RequestCard>
          ))
        )}
        {!isLeader && pending.length > 0 && <p className={styles.note}>Chỉ nhóm trưởng mới duyệt hoặc từ chối được.</p>}
      </main>

      <RequestPreviewSheet
        request={previewing}
        onClose={() => setPreviewId(null)}
        actions={previewing && isLeader ? <ApproveActions requestId={previewing.id} title={previewing.title} /> : undefined}
      />

      <BottomNav items={MAIN_NAV.map((i) => (i.key === 'requests' ? { ...i, badge: pending.length } : i))} activeKey="requests" />
    </>
  );
}
