'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { saveImage } from '@/core/utils/image.utils';
import { Button, Icon, MoneyText } from '@/modules/ui-core';
import styles from './QrViewer.module.scss';
import type { QrViewerProps } from './QrViewer.type';

/** Xem mã QR toàn màn hình để quét dễ, và tải ảnh QR về máy */
export function QrViewer({ open, onClose, momo, target }: QrViewerProps) {
  const [saved, setSaved] = useState<'' | 'shared' | 'downloaded' | 'error'>('');

  useEffect(() => {
    if (!open) return;
    setSaved('');
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || !momo.qrDataUrl) return null;

  const download = async () => {
    try {
      setSaved(await saveImage(momo.qrDataUrl as string, 'qr-quy-nhom-momo.png'));
    } catch {
      setSaved('error');
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.box} role="dialog" aria-modal="true" aria-label="Mã QR quỹ nhóm" onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Đóng">
          <Icon name="close" size={22} />
        </button>
        <span className={styles.brand}>Quỹ nhóm · MoMo</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={momo.qrDataUrl} alt="Mã QR MoMo của quỹ nhóm" className={styles.qr} />
        <div className={styles.info}>
          {momo.accountName && <b>{momo.accountName}</b>}
          {momo.phone && <span className={styles.phone}>{momo.phone}</span>}
          <span>Nội dung: <b>{momo.note}</b></span>
          <span>Mỗi người góp <MoneyText value={target} /></span>
        </div>
        <Button size="lg" variant="primary" block icon="arrow-down-right" onClick={download}>
          Tải mã QR về máy
        </Button>
        {saved === 'downloaded' && <p className={styles.note}>Đã tải ảnh QR. Mở app MoMo → Quét mã → chọn ảnh từ thư viện.</p>}
        {saved === 'shared' && <p className={styles.note}>Chọn “Lưu hình ảnh” để lưu vào thư viện ảnh.</p>}
        {saved === 'error' && <p className={styles.note}>Không tải được. Nhấn giữ vào ảnh QR rồi chọn “Lưu hình ảnh”.</p>}
        <p className={styles.hint}>Mẹo: nhấn giữ vào ảnh cũng lưu được.</p>
      </div>
    </div>,
    document.body,
  );
}
