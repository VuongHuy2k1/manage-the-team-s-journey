'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';
import { Icon } from '../../atoms/Icon/Icon';
import { cx } from '../../utils/classNames.utils';
import { isUiLocked } from '../../utils/uiLock.utils';
import styles from './SideNav.module.scss';
import type { SideNavProps } from './SideNav.type';

const guard = (event: MouseEvent) => {
  if (isUiLocked()) event.preventDefault();
};

/** Thanh điều hướng bên trái, chỉ hiện trên màn hình rộng (máy tính) */
export function SideNav({ items, activeKey, header, footer }: SideNavProps) {
  return (
    <aside className={styles.side} data-sidenav="">
      {header && <div className={styles.header}>{header}</div>}
      <nav className={styles.nav} aria-label="Điều hướng chính (máy tính)">
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <Link key={item.key} href={item.href} className={cx(styles.item, active && styles.active)} aria-current={active ? 'page' : undefined} onClick={guard}>
              <Icon name={item.icon} size={20} />
              <span className={styles.label}>{item.label}</span>
              {!!item.badge && <span className={styles.badge}>{item.badge}</span>}
            </Link>
          );
        })}
      </nav>
      {footer && <div className={styles.footer}>{footer}</div>}
    </aside>
  );
}
