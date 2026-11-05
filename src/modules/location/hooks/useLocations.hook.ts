'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { subscribeLocations } from '@/core/api/location.api';
import { useTripState } from '@/core/hooks/useTripState.hook';
import type { Member } from '@/modules/member/member.type';
import type { SharedLocation } from '../location.type';
import { distanceMeters, isStale } from '../utils/geo.utils';

/* Một kết nối Firestore dùng chung cho mọi nơi cần vị trí (màn Vị trí và bộ gửi vị trí nền) */
let items: SharedLocation[] = [];
let users = 0;
let unsubscribe: (() => void) | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  users += 1;
  if (users === 1) {
    unsubscribe = subscribeLocations((next) => {
      items = next;
      listeners.forEach((l) => l());
    });
  }
  return () => {
    listeners.delete(listener);
    users -= 1;
    if (users === 0) {
      unsubscribe?.();
      unsubscribe = null;
    }
  };
}

export interface MemberLocation {
  member: Member;
  location: SharedLocation | undefined;
  isMe: boolean;
  /** Đang chia sẻ và có toạ độ */
  visible: boolean;
  stale: boolean;
  distance: number | null;
}

export function useLocations() {
  const all = useSyncExternalStore(subscribe, () => items, () => items);
  const { members, currentMemberId } = useTripState();

  return useMemo(() => {
    const byId = new Map(all.map((l) => [l.uid, l]));
    const mine = byId.get(currentMemberId);
    const myPoint = mine?.sharing && mine.lat !== undefined && mine.lng !== undefined ? { lat: mine.lat, lng: mine.lng } : null;

    const rows: MemberLocation[] = members.map((member) => {
      const location = byId.get(member.id);
      const visible = Boolean(location?.sharing && location.lat !== undefined && location.lng !== undefined);
      return {
        member,
        location,
        isMe: member.id === currentMemberId,
        visible,
        stale: visible && location ? isStale(location.updatedAt) : false,
        distance:
          visible && myPoint && location && member.id !== currentMemberId
            ? distanceMeters(myPoint, { lat: location.lat as number, lng: location.lng as number })
            : null,
      };
    });

    rows.sort((a, b) => {
      if (a.isMe !== b.isMe) return a.isMe ? -1 : 1;
      if (a.visible !== b.visible) return a.visible ? -1 : 1;
      return (a.distance ?? Infinity) - (b.distance ?? Infinity);
    });

    return { rows, mine, sharingCount: rows.filter((r) => r.visible).length };
  }, [all, members, currentMemberId]);
}

/** Dùng khi chỉ cần biết mình có đang bật chia sẻ không */
export function useLocationsList(): SharedLocation[] {
  return useSyncExternalStore(subscribe, () => items, () => items);
}
