'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { tripStore, type SyncMeta, type TripState } from '../store/trip.store';

/** Dữ liệu chuyến đi (đồng bộ realtime với Firebase) */
export function useTripState(): TripState {
  useEffect(() => tripStore.start(), []);
  return useSyncExternalStore(tripStore.subscribe, tripStore.getState, tripStore.getServerState);
}

/** Trạng thái kết nối: đăng nhập, thành viên, đã tải xong chưa */
export function useSyncMeta(): SyncMeta {
  useEffect(() => tripStore.start(), []);
  return useSyncExternalStore(tripStore.subscribe, tripStore.getMeta, tripStore.getServerMeta);
}
