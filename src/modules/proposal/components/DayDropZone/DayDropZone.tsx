'use client';

import { useDroppable } from '@dnd-kit/core';
import { Icon, cx } from '@/modules/ui-core';
import { DAY_DROP_PREFIX } from '../../hooks/useDragReorder.hook';
import styles from './DayDropZone.module.scss';
import type { DayDropZoneProps } from './DayDropZone.type';

/** Ô thả thẻ để chuyển mốc sang ngày khác (chỉ hiện khi đang kéo) */
export function DayDropZone({ day, label, count }: DayDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `${DAY_DROP_PREFIX}${day}` });
  return (
    <div ref={setNodeRef} className={cx(styles.zone, isOver && styles.over)} aria-label={`Thả vào đây để chuyển sang ${label}`}>
      <Icon name="arrow-right" size={16} />
      <span className={styles.text}>
        <b>{label}</b>
        <span>{isOver ? 'Thả để chuyển' : `${count} mốc`}</span>
      </span>
    </div>
  );
}
