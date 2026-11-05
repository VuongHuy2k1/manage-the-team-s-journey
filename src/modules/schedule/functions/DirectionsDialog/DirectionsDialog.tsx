'use client';

import { ConfirmDialog, Button } from '@/modules/ui-core';
import { hasPin, isPlaceholderAddress } from '../../utils/maps.utils';
import styles from './DirectionsDialog.module.scss';
import type { DirectionsDialogProps } from './DirectionsDialog.type';

export function DirectionsDialog({ block, url, onClose }: DirectionsDialogProps) {
  if (!block) return null;
  const placeholder = !hasPin(block) && isPlaceholderAddress(block.address);
  return (
    <ConfirmDialog
      open
      onClose={onClose}
      icon="navigate"
      title="Bạn muốn chỉ đường?"
      subtitle={<>Đến <b className={styles.place}>{block.title}</b></>}
      actions={
        <>
          <Button size="lg" onClick={onClose}>Huỷ</Button>
          <a className={styles.go} href={url} target="_blank" rel="noopener noreferrer" onClick={onClose}>
            OK, mở Google Maps
          </a>
        </>
      }
    >
      <p className={styles.address}>{block.address}</p>
      <p className={styles.note}>
        {placeholder
          ? 'Mốc này chưa có địa chỉ cụ thể, Google Maps sẽ tìm theo tên địa điểm.'
          : 'Google Maps sẽ mở và chỉ đường từ vị trí hiện tại của bạn.'}
      </p>
    </ConfirmDialog>
  );
}
