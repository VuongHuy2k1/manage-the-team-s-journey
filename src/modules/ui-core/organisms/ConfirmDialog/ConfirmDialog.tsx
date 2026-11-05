'use client';

import { useEffect } from 'react';
import { useUiLocked } from '../../hooks/useUiLocked.hook';
import { isUiLocked } from '../../utils/uiLock.utils';
import { Icon } from '../../atoms/Icon/Icon';
import { cx } from '../../utils/classNames.utils';
import styles from './ConfirmDialog.module.scss';
import type { ConfirmDialogProps } from './ConfirmDialog.type';

export function ConfirmDialog({ open, onClose, title, subtitle, icon, iconTone = 'primary', children, actions }: ConfirmDialogProps) {
  const locked = useUiLocked();
  /** Đang gửi dữ liệu thì không cho đóng */
  const close = () => {
    if (!isUiLocked()) onClose();
  };
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !isUiLocked() && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={close} aria-busy={locked || undefined}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          {icon && (
            <span className={cx(styles.icon, styles[iconTone])}>
              <Icon name={icon} size={24} strokeWidth={2.4} />
            </span>
          )}
          <div className={styles.titles}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          </div>
        </div>
        {children}
        <div className={styles.actions}>{actions}</div>
      </div>
    </div>
  );
}
