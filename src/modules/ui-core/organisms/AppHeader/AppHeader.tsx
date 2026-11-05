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

export function AppHeader({ title, eyebrow, variant = 'brand', backHref, aside, children, decorated = false }: AppHeaderProps) {
  return (
    <header className={cx(styles.header, styles[variant])}>
      {decorated && (
        <svg className={styles.hills} viewBox="0 0 390 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
          <path d="M140 80 L210 34 L250 60 L300 22 L350 56 L390 40 L390 80 Z" fill="currentColor" />
          <circle cx="352" cy="22" r="10" fill="#FFA31A" />
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
          <h1 className={styles.title}>{title}</h1>
        </div>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
      {children && <div className={styles.bottom}>{children}</div>}
    </header>
  );
}
