'use client';

import { AvatarStack, Button } from '@/modules/ui-core';
import { useRequests } from '../../hooks/useRequests.hook';
import styles from './VotePanel.module.scss';
import type { VotePanelProps } from './VotePanel.type';

export function VotePanel({ view }: VotePanelProps) {
  const { vote } = useRequests();
  const id = view.request.id;
  return (
    <div className={styles.panel}>
      <div className={styles.summary}>
        {view.voters.length > 0 && <AvatarStack people={view.voters} max={5} />}
        <span><b>{view.up} đồng ý</b> · {view.down} không · {view.notVoted} chưa bầu</span>
      </div>
      <div className={styles.buttons}>
        <Button size="sm" variant={view.myVote === 'up' ? 'primary' : 'secondary'} icon="thumb-up" aria-pressed={view.myVote === 'up'} onClick={() => vote(id, 'up')}>
          Đồng ý
        </Button>
        <Button size="sm" variant={view.myVote === 'down' ? 'primary' : 'secondary'} icon="thumb-down" aria-pressed={view.myVote === 'down'} onClick={() => vote(id, 'down')}>
          Không
        </Button>
      </div>
    </div>
  );
}
