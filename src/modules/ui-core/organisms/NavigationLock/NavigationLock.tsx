'use client';

import { useEffect } from 'react';
import { useUiLocked } from '../../hooks/useUiLocked.hook';
import { isUiLocked, subscribeUiLock } from '../../utils/uiLock.utils';
import styles from './NavigationLock.module.scss';
import type { NavigationLockProps } from './NavigationLock.type';

/**
 * Đặt một lần ở gốc ứng dụng.
 * Trong lúc đang gửi: chặn nút Back của trình duyệt / vuốt quay lại,
 * hỏi lại khi tải lại hay đóng tab, và hiện thanh "Đang lưu…".
 */
export function NavigationLock({ label = 'Đang lưu, vui lòng chờ…' }: NavigationLockProps) {
  const locked = useUiLocked();

  useEffect(() => {
    const GUARD = '__uiLockGuard';
    const onGuard = () => Boolean((window.history.state as Record<string, unknown> | null)?.[GUARD]);
    /** Thêm một mục lịch sử trùng trang hiện tại để nút Back chỉ "ăn" vào mục này */
    const pushGuard = () => {
      if (onGuard()) return;
      window.history.pushState({ ...(window.history.state ?? {}), [GUARD]: true }, '', window.location.href);
    };
    let releaseTimer: number | undefined;
    const onLockChange = () => {
      window.clearTimeout(releaseTimer);
      if (isUiLocked()) {
        pushGuard();
        return;
      }
      // Hết khoá: bỏ mục chốt (nếu vẫn đang đứng trên nó và không chuyển trang) để Back hoạt động bình thường
      releaseTimer = window.setTimeout(() => {
        if (!isUiLocked() && onGuard()) window.history.back();
      }, 400);
    };
    const onPopState = (event: PopStateEvent) => {
      if (isUiLocked()) {
        // Đang gửi: Back chỉ về mục trùng trang, đặt lại chốt chặn
        pushGuard();
        return;
      }
      // Hết khoá mà quay về mục chốt cũ (trùng trang) thì lùi thêm một bước cho tự nhiên
      if ((event.state as Record<string, unknown> | null)?.[GUARD]) window.history.back();
    };
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isUiLocked()) return;
      event.preventDefault();
      event.returnValue = '';
    };
    const unsubscribe = subscribeUiLock(onLockChange);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      unsubscribe();
      window.clearTimeout(releaseTimer);
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  if (!locked) return null;
  return (
    <div className={styles.bar} role="status" aria-live="polite">
      <span className={styles.track} aria-hidden="true">
        <span className={styles.runner} />
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
