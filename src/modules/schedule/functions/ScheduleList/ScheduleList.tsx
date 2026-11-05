'use client';

import { useState } from 'react';
import { undoCompletion } from '@/core/store/trip.actions';
import { ConfirmCompleteDialog } from '@/modules/completion';
import { useIsLeader } from '@/modules/member';
import { Button, TickButton, Toast, useToast } from '@/modules/ui-core';
import { ScheduleBlock } from '../../components/ScheduleBlock/ScheduleBlock';
import { useDirections } from '../../hooks/useDirections.hook';
import type { Block } from '../../schedule.type';
import { DirectionsDialog } from '../DirectionsDialog/DirectionsDialog';
import styles from './ScheduleList.module.scss';
import type { ScheduleListProps } from './ScheduleList.type';

export function ScheduleList({ blocks, memberCount, pendingIds }: ScheduleListProps) {
  const directions = useDirections();
  const isLeader = useIsLeader();
  const [completing, setCompleting] = useState<Block | null>(null);
  const { toast, show } = useToast();

  if (blocks.length === 0) {
    return <p className={styles.empty}>Đã xong hết các mốc trong ngày này.</p>;
  }

  return (
    <>
      <ul className={styles.list}>
        {blocks.map((block) => {
          const pending = pendingIds.has(block.id);
          return (
            <li key={block.id}>
              <ScheduleBlock
                block={block}
                memberCount={memberCount}
                status={pending ? (isLeader ? 'Có người báo xong · chờ bạn xác nhận' : 'Chờ nhóm trưởng xác nhận') : undefined}
                trailing={
                  <>
                    <Button variant="ghost" size="md" icon="navigate" aria-label={`Chỉ đường tới ${block.title}`} onClick={() => directions.open(block)} className={styles.navBtn} />
                    <TickButton label={`Hoàn thành ${block.title}`} pending={pending} onClick={() => setCompleting(block)} />
                  </>
                }
              />
            </li>
          );
        })}
      </ul>

      <DirectionsDialog block={directions.target} url={directions.url} onClose={directions.close} />
      <ConfirmCompleteDialog
        block={completing}
        onClose={() => setCompleting(null)}
        onDone={({ block, confirmed }) =>
          show(
            confirmed
              ? { message: `Đã chuyển "${block.title}" sang Đã hoàn thành`, actionLabel: 'Hoàn tác', onAction: () => undoCompletion(block.id) }
              : { message: `Đã gửi nhóm trưởng xác nhận "${block.title}"` },
          )
        }
      />
      <Toast open={Boolean(toast)} message={toast?.message ?? ''} actionLabel={toast?.actionLabel} onAction={toast?.onAction} />
    </>
  );
}
