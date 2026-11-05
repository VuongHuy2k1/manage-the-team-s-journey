'use client';

import { useState } from 'react';
import { formatWhen } from '@/core/utils/time.utils';
import { memberName, shortName } from '@/modules/member/utils/role.utils';
import { Button, ConfirmDialog, SegmentedControl, Timeline } from '@/modules/ui-core';
import { HistoryItem } from '../../components/HistoryItem/HistoryItem';
import { useHistory, type HistoryEntry, type HistoryFilter } from '../../hooks/useHistory.hook';
import styles from './HistoryTimeline.module.scss';

const FILTERS: { value: HistoryFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Từ chối' },
  { value: 'mine', label: 'Của tôi' },
];

const DOT: Record<HistoryEntry['status'], string> = {
  create: 'var(--c-primary)',
  approve: '#14A37F',
  restore: 'var(--c-accent)',
  edit: '#FF8A1F',
  reject: '#E04848',
};

export function HistoryTimeline() {
  const h = useHistory();
  const [confirming, setConfirming] = useState<number | null>(null);

  const decision = (e: HistoryEntry) => {
    const who = shortName(memberName(h.membersById, e.decidedBy));
    if (e.status === 'reject') return `${who} từ chối`;
    if (e.status === 'restore') return `${who} khôi phục`;
    if (e.status === 'edit') return `${who} sửa trực tiếp`;
    return `${who} duyệt${e.votesUp !== undefined ? ` · ${e.votesUp}/${h.memberCount} đồng ý` : ''}`;
  };

  return (
    <div className={styles.wrap}>
      <SegmentedControl options={FILTERS} value={h.filter} onChange={h.setFilter} ariaLabel="Lọc lịch sử" wrap />
      {h.entries.length === 0 ? (
        <p className={styles.empty}>Không có mục nào.</p>
      ) : (
        <Timeline
          items={h.entries.map((e) => ({
            key: e.key,
            color: DOT[e.status],
            content: (
              <HistoryItem
                status={e.status}
                versionLabel={e.versionNumber ? `v${e.versionNumber}` : undefined}
                when={formatWhen(e.at)}
                title={e.title}
                proposedByName={memberName(h.membersById, e.proposedBy)}
                decisionText={e.status === 'create' ? 'Lịch đầu tiên' : decision(e)}
                changes={e.changes}
                note={e.note}
                action={
                  h.isLeader && e.versionNumber && e.versionNumber < h.latestVersion ? (
                    <Button size="sm" icon="history" onClick={() => setConfirming(e.versionNumber ?? null)} className={styles.restore}>
                      Khôi phục về phiên bản này
                    </Button>
                  ) : undefined
                }
              />
            ),
          }))}
        />
      )}

      <ConfirmDialog
        open={confirming !== null}
        onClose={() => setConfirming(null)}
        icon="history"
        iconTone="warn"
        title={`Khôi phục về v${confirming}?`}
        subtitle="Lịch chính thức sẽ trở lại như phiên bản này. Thao tác được ghi vào lịch sử, có thể khôi phục lại sau."
        actions={
          <>
            <Button size="lg" onClick={() => setConfirming(null)}>Huỷ</Button>
            <Button size="lg" variant="primary" onClick={async () => { if (confirming) await h.restore(confirming); setConfirming(null); }} loadingText="Đang khôi phục…">Khôi phục</Button>
          </>
        }
      />
    </div>
  );
}
