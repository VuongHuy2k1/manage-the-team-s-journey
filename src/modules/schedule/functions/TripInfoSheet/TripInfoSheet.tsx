'use client';

import { useEffect, useState } from 'react';
import { BottomSheet, Button, FormField, Input, notify } from '@/modules/ui-core';
import { useTripInfo } from '../../hooks/useTripInfo.hook';
import styles from './TripInfoSheet.module.scss';
import type { TripInfoSheetProps } from './TripInfoSheet.type';

/** Nhóm trưởng sửa tên chuyến và dòng mô tả; cả nhóm thấy ngay */
export function TripInfoSheet({ open, onClose }: TripInfoSheetProps) {
  const t = useTripInfo();
  const [name, setName] = useState(t.name);
  const [subtitle, setSubtitle] = useState(t.subtitle);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(t.name);
    setSubtitle(t.subtitle);
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const save = async () => {
    if (!name.trim()) {
      setError('Nhập tên chuyến.');
      return;
    }
    if (await t.save({ name, subtitle })) {
      notify('Đã cập nhật thông tin chuyến');
      onClose();
    }
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      label="Sửa thông tin chuyến"
      header={
        <span className={styles.header}>
          <span className={styles.heading}>Sửa thông tin chuyến</span>
          <span className={styles.sub}>Chỉ nhóm trưởng sửa được · cả nhóm thấy ngay</span>
        </span>
      }
      footer={
        <>
          <Button size="lg" onClick={onClose}>Huỷ</Button>
          <Button size="lg" variant="primary" icon="check" block onClick={save} loadingText="Đang lưu…">
            Lưu thay đổi
          </Button>
        </>
      }
    >
      <FormField label="Tên chuyến" htmlFor="trip-name" error={error || undefined}>
        <Input id="trip-name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Đà Lạt 3N2Đ" />
      </FormField>
      <FormField label="Dòng mô tả" htmlFor="trip-sub" hint="Ví dụ: tuyến xe, ngày đi – ngày về. Số người tự cập nhật.">
        <Input id="trip-sub" value={subtitle} maxLength={80} onChange={(e) => setSubtitle(e.target.value)} placeholder="Ví dụ: An Sương ⇄ Đà Lạt" />
      </FormField>
      <div className={styles.preview} aria-label="Xem trước">
        <span className={styles.previewLabel}>Xem trước</span>
        <b className={styles.previewName}>{name.trim() || 'Tên chuyến'}</b>
        <span className={styles.previewSub}>
          {[subtitle.trim(), `${t.memberCount} người`].filter(Boolean).join(' · ')}
        </span>
      </div>
    </BottomSheet>
  );
}
