'use client';

import { useEffect, useRef } from 'react';
import { publishMyLocation } from '@/core/api/location.api';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { distanceMeters } from '../utils/geo.utils';
import { useLocationsList } from './useLocations.hook';

const MIN_INTERVAL_MS = 20_000;
const HEARTBEAT_MS = 90_000;
const MIN_MOVE_M = 30;

/**
 * Khi đang bật chia sẻ: theo dõi vị trí và gửi lên khi di chuyển > 30 m hoặc mỗi 90 giây.
 * Chỉ chạy khi web đang mở (trình duyệt không cho chạy nền).
 */
export function useLocationBeacon() {
  const { currentMemberId } = useTripState();
  const items = useLocationsList();
  const sharing = Boolean(items.find((l) => l.uid === currentMemberId)?.sharing);
  const last = useRef<{ lat: number; lng: number; at: number } | null>(null);

  useEffect(() => {
    if (!sharing || !currentMemberId || !('geolocation' in navigator) || !window.isSecureContext) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const point = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const now = Date.now();
        const prev = last.current;
        const moved = prev ? distanceMeters(prev, point) : Infinity;
        const elapsed = prev ? now - prev.at : Infinity;
        if (elapsed < MIN_INTERVAL_MS) return;
        if (moved < MIN_MOVE_M && elapsed < HEARTBEAT_MS) return;
        last.current = { ...point, at: now };
        void publishMyLocation(currentMemberId, { ...point, accuracy: pos.coords.accuracy }).catch(() => undefined);
      },
      () => undefined,
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 30000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [sharing, currentMemberId]);
}
