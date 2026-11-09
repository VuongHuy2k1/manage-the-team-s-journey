'use client';

import { useRef, useState } from 'react';
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

/**
 * Kéo thả sắp xếp một danh sách id bằng cả thẻ.
 * Máy tính: nhấn giữ chuột và kéo. Điện thoại: chạm giữ ~0,25 giây rồi kéo (chạm nhanh vẫn để mở / cuộn trang).
 */
/** id vùng thả "chuyển sang ngày khác" */
export const DAY_DROP_PREFIX = 'day-drop-';

export function useDragReorder(
  ids: string[],
  onReorder: (orderedIds: string[]) => void,
  onMoveToDay?: (id: string, day: number) => void,
) {
  const [activeId, setActiveId] = useState<string | null>(null);
  // Ngay sau khi thả, trình duyệt vẫn bắn sự kiện click: bỏ qua để không mở nhầm bảng sửa
  const justDropped = useRef(0);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const finish = () => {
    setActiveId(null);
    justDropped.current = Date.now();
  };

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    navigator.vibrate?.(15);
  };
  const onDragCancel = finish;
  const onDragEnd = (event: DragEndEvent) => {
    finish();
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const overId = String(over.id);
    if (overId.startsWith(DAY_DROP_PREFIX)) {
      onMoveToDay?.(String(active.id), Number(overId.slice(DAY_DROP_PREFIX.length)));
      return;
    }
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    onReorder(arrayMove(ids, from, to));
  };

  return {
    sensors,
    activeId,
    onDragStart,
    onDragEnd,
    onDragCancel,
    /** true nếu vừa thả xong (dưới 250ms) */
    wasJustDropped: () => Date.now() - justDropped.current < 250,
  };
}
