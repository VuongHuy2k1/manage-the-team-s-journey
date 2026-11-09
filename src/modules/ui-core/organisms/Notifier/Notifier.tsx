'use client';

import { useSyncExternalStore } from 'react';
import { Icon } from '../../atoms/Icon/Icon';
import type { IconName } from '../../atoms/Icon/Icon.type';
import { cx } from '../../utils/classNames.utils';
import { dismissNotice, getNotice, subscribeNotice, type NotifyTone } from '../../utils/notify.utils';
import styles from './Notifier.module.scss';

const ICON: Record<NotifyTone, IconName> = { success: 'check', info: 'info', error: 'close' };

/** Đặt một lần ở gốc: hiện thông báo gọi bằng notify() */
export function Notifier() {
  const notice = useSyncExternalStore(subscribeNotice, getNotice, () => null);
  if (!notice) return null;
  return (
    <div key={notice.id} className={cx(styles.toast, styles[notice.tone])} role="status" aria-live="polite" onClick={dismissNotice}>
      <span className={styles.icon}>
        <Icon name={ICON[notice.tone]} size={16} strokeWidth={2.6} />
      </span>
      <span className={styles.message}>{notice.message}</span>
    </div>
  );
}
