'use client';

import { timeAgo } from '@/core/utils/time.utils';
import { LocationRow } from '../../components/LocationRow/LocationRow';
import type { MemberLocation } from '../../hooks/useLocations.hook';
import { directionsToPoint, formatDistance } from '../../utils/geo.utils';
import styles from './LocationList.module.scss';
import type { LocationListProps } from './LocationList.type';

function statusText(row: MemberLocation): string {
  if (!row.visible || !row.location) return row.isMe ? 'Bạn chưa bật chia sẻ' : 'Chưa chia sẻ vị trí';
  const when = timeAgo(row.location.updatedAt);
  if (row.isMe) return `Vị trí của bạn · ${when}`;
  const dist = row.distance !== null ? `Cách ${formatDistance(row.distance)} · ` : '';
  return `${dist}${when}${row.stale ? ' (có thể đã đổi chỗ)' : ''}`;
}

export function LocationList({ rows, onFocus }: LocationListProps) {
  return (
    <ul className={styles.list}>
      {rows.map((row) => (
        <li key={row.member.id}>
          <LocationRow
            member={row.member}
            isMe={row.isMe}
            visible={row.visible}
            stale={row.stale}
            status={statusText(row)}
            onFocus={() => onFocus(row.member.id)}
            directionsUrl={row.visible && !row.isMe && row.location ? directionsToPoint(row.location.lat as number, row.location.lng as number) : undefined}
          />
        </li>
      ))}
    </ul>
  );
}
