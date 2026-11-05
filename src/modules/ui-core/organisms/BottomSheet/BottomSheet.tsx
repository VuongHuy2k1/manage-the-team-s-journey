'use client';

import { useEffect } from 'react';
import { useUiLocked } from '../../hooks/useUiLocked.hook';
import { isUiLocked } from '../../utils/uiLock.utils';
import { Icon } from '../../atoms/Icon/Icon';
import styles from './BottomSheet.module.scss';
import type { BottomSheetProps } from './BottomSheet.type';

export function BottomSheet({ open, onClose, label, header, children, footer }: BottomSheetProps) {
  const locked = useUiLocked();
  /** Đang gửi dữ liệu thì không cho đóng */
  const close = () => {
    if (!isUiLocked()) onClose();
  };
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !isUiLocked() && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={close} aria-busy={locked || undefined}>
      <section className={styles.sheet} role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
        <span className={styles.handle} aria-hidden="true" />
        <div className={styles.head}>
          <div className={styles.headContent}>{header}</div>
          <button type="button" className={styles.close} aria-label="Đóng" onClick={close} disabled={locked}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </section>
    </div>
  );
}
