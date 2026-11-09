'use client';

import { Icon, useDisclosure } from '@/modules/ui-core';
import { useTripInfo } from '../../hooks/useTripInfo.hook';
import { TripInfoSheet } from '../TripInfoSheet/TripInfoSheet';
import styles from './TripTitleEdit.module.scss';
import type { TripTitleEditProps } from './TripTitleEdit.type';

/** Nút bút chì cạnh tên chuyến, chỉ hiện với nhóm trưởng */
export function TripTitleEdit({ tone = 'onDark' }: TripTitleEditProps) {
  const t = useTripInfo();
  const sheet = useDisclosure();
  if (!t.canEdit) return null;
  return (
    <>
      <button type="button" className={`${styles.button} ${styles[tone]}`} onClick={sheet.open} aria-label="Sửa tên chuyến">
        <Icon name="edit" size={15} />
      </button>
      <TripInfoSheet open={sheet.isOpen} onClose={sheet.close} />
    </>
  );
}
