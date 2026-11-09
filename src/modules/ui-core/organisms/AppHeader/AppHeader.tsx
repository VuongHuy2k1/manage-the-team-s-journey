'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';
import { isUiLocked } from '../../utils/uiLock.utils';

/** Đang gửi dữ liệu thì không cho chuyển trang */
const guard = (event: MouseEvent) => {
  if (isUiLocked()) event.preventDefault();
};
import { Icon } from '../../atoms/Icon/Icon';
import { cx } from '../../utils/classNames.utils';
import styles from './AppHeader.module.scss';
import type { AppHeaderProps } from './AppHeader.type';

export function AppHeader({ title, eyebrow, variant = 'brand', backHref, aside, children, decorated = false, titleAction }: AppHeaderProps) {
  return (
    <header className={cx(styles.header, styles[variant])}>
      {decorated && (
        <svg className={styles.hills} viewBox="0 0 180 140" aria-hidden="true">
          <circle cx="110" cy="60" r="70" fill="currentColor" opacity="0.07" />
          <circle cx="150" cy="112" r="40" fill="currentColor" opacity="0.07" />
        </svg>
      )}
      <div className={styles.top}>
        {backHref && (
          <Link href={backHref} className={styles.back} aria-label="Quay lại" onClick={guard}>
            <Icon name="back" size={22} strokeWidth={2.2} />
          </Link>
        )}
        <div className={styles.titles}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          {titleAction ? (
            <span className={styles.titleRow}>
              <h1 className={styles.title}>{title}</h1>
              {titleAction}
            </span>
          ) : (
            <h1 className={styles.title}>{title}</h1>
          )}
        </div>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
      {children && <div className={styles.bottom}>{children}</div>}
    </header>
  );
}
