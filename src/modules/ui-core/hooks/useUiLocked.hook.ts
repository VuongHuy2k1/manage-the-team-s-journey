'use client';

import { useSyncExternalStore } from 'react';
import { isUiLocked, subscribeUiLock } from '../utils/uiLock.utils';

/** true khi đang gửi dữ liệu (popup không đóng được, không chuyển trang được) */
export function useUiLocked(): boolean {
  return useSyncExternalStore(subscribeUiLock, isUiLocked, () => false);
}
