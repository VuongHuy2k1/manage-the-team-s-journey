'use client';

import { timeAgo } from '@/core/utils/time.utils';
import { ShareCard } from '../../components/ShareCard/ShareCard';
import { useMySharing } from '../../hooks/useMySharing.hook';
import type { ShareToggleProps } from './ShareToggle.type';

export function ShareToggle({ sharingCount }: ShareToggleProps) {
  const s = useMySharing();
  return (
    <ShareCard
      sharing={s.sharing}
      updatedText={s.updatedAt ? `cập nhật ${timeAgo(s.updatedAt)}` : undefined}
      busy={s.busy}
      errorText={s.errorText || undefined}
      sharingCount={sharingCount}
      onToggle={s.toggle}
    />
  );
}
