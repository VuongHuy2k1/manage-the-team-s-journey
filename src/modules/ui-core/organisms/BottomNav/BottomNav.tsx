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
import styles from './BottomNav.module.scss';
import type { BottomNavProps } from './BottomNav.type';

export function BottomNav({ items, activeKey }: BottomNavProps) {
  return (
    <nav className={styles.nav} aria-label="Điều hướng chính">
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <Link key={item.key} href={item.href} className={cx(styles.item, active && styles.active)} aria-current={active ? 'page' : undefined} onClick={guard}>
            <span className={styles.iconWrap}>
              <Icon name={item.icon} size={22} />
              {!!item.badge && <span className={styles.badge}>{item.badge}</span>}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
