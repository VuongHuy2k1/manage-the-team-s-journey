'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/core/config/routes.config';
import { useSyncMeta } from '@/core/hooks/useTripState.hook';
import { tripStore } from '@/core/store/trip.store';
import { LocationBeacon } from '@/modules/location';
import { signOutAccount } from '@/core/api/account.api';
import { Button, NavigationLock, Toast } from '@/modules/ui-core';
import styles from './AuthGate.module.scss';
import type { AuthGateProps } from './AuthGate.type';

/** Chặn các màn trong chuyến cho tới khi đã đăng nhập, vào nhóm và tải xong dữ liệu */
export function AuthGate({ children }: AuthGateProps) {
  const meta = useSyncMeta();
  const router = useRouter();
  const pathname = usePathname();

  const mustEnter =
    !meta.configured || meta.auth === 'signedOut' || meta.membership === 'none' || meta.membership === 'removed';

  useEffect(() => {
    if (mustEnter) router.replace(`${ROUTES.enter}?next=${encodeURIComponent(pathname)}`);
  }, [mustEnter, pathname, router]);

  const waiting = !mustEnter && !(meta.trip === 'ready' && meta.membersReady) && meta.trip !== 'missing' && meta.trip !== 'error';
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!waiting) {
      setSlow(false);
      return;
    }
    const t = setTimeout(() => setSlow(true), 12000);
    return () => clearTimeout(t);
  }, [waiting]);

  // Thay đổi nằm chờ trên máy quá 10 giây = không gửi được lên server
  const [stuckSync, setStuckSync] = useState(false);
  useEffect(() => {
    if (!meta.pendingSync) {
      setStuckSync(false);
      return;
    }
    const t = setTimeout(() => setStuckSync(true), 10000);
    return () => clearTimeout(t);
  }, [meta.pendingSync]);

  useEffect(() => {
    if (!meta.error) return;
    const t = setTimeout(() => tripStore.clearError(), 4000);
    return () => clearTimeout(t);
  }, [meta.error]);

  if (meta.membership === 'member' && meta.trip === 'missing') {
    if (meta.me?.role === 'leader') {
      return (
        <div className={styles.center}>
          <p className={styles.title}>Đang tạo lịch trình cho cả nhóm…</p>
          {meta.error && <p className={styles.error} role="alert">{meta.error} Kiểm tra quy tắc bảo mật (Rules) đã Publish chưa.</p>}
          <Button variant="primary" onClick={() => tripStore.createTrip()} loadingText="Đang tạo…">Tạo lại</Button>
        </div>
      );
    }
    return (
      <div className={styles.center}>
        <p className={styles.title}>Sổ tay chưa được mở</p>
        <p className={styles.text}>Nhóm trưởng cần vào lần đầu để tạo lịch trình cho cả nhóm. Trang sẽ tự cập nhật khi xong.</p>
        <div className={styles.actions}>
          <Button variant="primary" icon="lock" href={`${ROUTES.enter}?role=leader&next=${encodeURIComponent(pathname)}`}>
            Tôi là nhóm trưởng
          </Button>
          <Button variant="ghost" icon="logout" onClick={() => void signOutAccount()}>Đăng xuất</Button>
        </div>
      </div>
    );
  }
  if (meta.trip === 'error') {
    return (
      <div className={styles.center}>
        <p className={styles.title}>Không tải được dữ liệu</p>
        <p className={styles.text}>Kiểm tra mạng, hoặc quy tắc bảo mật Firestore đã dán đúng chưa.</p>
      </div>
    );
  }
  if (mustEnter || meta.trip !== 'ready' || !meta.membersReady) {
    const stage =
      meta.auth === 'loading'
        ? 'Đang kiểm tra đăng nhập…'
        : meta.membership === 'unknown'
          ? 'Đang tải hồ sơ của bạn…'
          : meta.trip !== 'ready'
            ? 'Đang tải lịch trình…'
            : 'Đang tải danh sách thành viên…';
    return (
      <div className={styles.center} role="status">
        <p className={styles.text}>{stage}</p>
        {slow && (
          <div className={styles.help}>
            <p className={styles.title}>Kết nối tới Firebase quá lâu</p>
            <ul className={styles.list}>
              <li>Tắt trình chặn quảng cáo (AdBlock, uBlock…) cho trang này, hoặc thử cửa sổ ẩn danh.</li>
              <li>Kiểm tra đã tạo Firestore Database (Standard, database “(default)”) trong Firebase.</li>
              <li>Kiểm tra mạng, rồi tải lại trang.</li>
            </ul>
            <div className={styles.actions}>
              <Button onClick={() => window.location.reload()}>Tải lại</Button>
              {meta.auth === 'signedIn' && <Button variant="ghost" onClick={() => void signOutAccount()}>Đăng xuất</Button>}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {stuckSync && (
        <div className={styles.syncBar} role="alert">
          <b>Máy này chưa gửi được dữ liệu lên server.</b> Thay đổi chỉ nằm trên máy bạn, người khác chưa thấy.
          Tắt trình chặn quảng cáo / tiện ích cho trang này hoặc thử trình duyệt khác, rồi tải lại.
        </div>
      )}
      {children}
      <NavigationLock />
      <LocationBeacon />
      <Toast open={Boolean(meta.error)} message={meta.error ?? ''} />
    </>
  );
}
