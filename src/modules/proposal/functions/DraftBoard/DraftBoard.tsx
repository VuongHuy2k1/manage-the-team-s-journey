'use client';

import { useState } from 'react';
import { DndContext, MeasuringStrategy, closestCenter, pointerWithin, type CollisionDetection } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ScheduleBlock } from '@/modules/schedule/components/ScheduleBlock/ScheduleBlock';
import type { Block, DayNumber } from '@/modules/schedule/schedule.type';
import { Badge, Button, Icon, cx } from '@/modules/ui-core';
import { useDraft } from '../../hooks/useDraft.hook';
import { DAY_DROP_PREFIX, useDragReorder } from '../../hooks/useDragReorder.hook';
import { DayDropZone } from '../../components/DayDropZone/DayDropZone';
import { TRIP_DAYS } from '@/modules/schedule/utils/schedule.utils';
import type { ChangeKind } from '../../proposal.type';
import { BlockEditorSheet } from '../BlockEditorSheet/BlockEditorSheet';
import styles from './DraftBoard.module.scss';
import type { DraftBoardProps } from './DraftBoard.type';

/** Ngón tay đang nằm trên ô "chuyển ngày" thì ưu tiên ô đó, còn lại sắp xếp như thường */
const collision: CollisionDetection = (args) => {
  const hit = pointerWithin(args).find((c) => String(c.id).startsWith(DAY_DROP_PREFIX));
  return hit ? [hit] : closestCenter({ ...args, droppableContainers: args.droppableContainers.filter((c) => !String(c.id).startsWith(DAY_DROP_PREFIX)) });
};

const BADGE: Record<ChangeKind, string> = { moved: 'Đã dời', edited: 'Đã sửa', added: 'Mới', deleted: 'Xoá' };

interface SortableRowProps {
  block: Block;
  memberCount: number;
  kind?: ChangeKind;
  oldTime?: string;
  lifted: boolean;
  demo?: boolean;
  onSelect: () => void;
}

/** Cả thẻ là vùng kéo; tay nắm ⋮⋮ chỉ để gợi ý và dùng bàn phím */
function SortableRow({ block, memberCount, kind, oldTime, lifted, demo, onSelect }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cx(styles.row, lifted && styles.lifting, demo && styles.demo)}
      {...listeners}
    >
      <ScheduleBlock
        block={block}
        memberCount={memberCount}
        tone={lifted ? 'lifted' : kind ?? 'default'}
        oldTime={oldTime}
        badge={kind && <Badge kind={kind}>{BADGE[kind]}</Badge>}
        onSelect={onSelect}
        leading={
          <span className={styles.grip} aria-label={`Kéo để đổi chỗ ${block.title}`} {...attributes}>
            <Icon name="grip" size={20} />
          </span>
        }
      />
    </li>
  );
}

export function DraftBoard({ day, onDayChange, demo }: DraftBoardProps) {
  const draft = useDraft();
  const blocks = draft.dayBlocks(day);
  const ids = blocks.map((b) => b.id);
  const [movedNote, setMovedNote] = useState<string | null>(null);
  const drag = useDragReorder(
    ids,
    (ordered) => draft.reorderDay(day, ordered),
    (id, target) => {
      const block = blocks.find((b) => b.id === id);
      draft.moveToDay(id, target as Exclude<DayNumber, 0>);
      setMovedNote(block ? `Đã chuyển “${block.title}” sang Ngày ${target}` : null);
      onDayChange?.(target as Exclude<DayNumber, 0>);
    },
  );
  const [editing, setEditing] = useState<Block | null>(null);
  const [adding, setAdding] = useState(false);
  const baseById = new Map(draft.base.map((b) => [b.id, b]));

  return (
    <>
      <p className={styles.hint}>Nhấn giữ thẻ rồi kéo để đổi thứ tự hoặc thả xuống ô ngày khác · chạm nhanh để sửa</p>
      {movedNote && (
        <p className={styles.moved} role="status">
          {movedNote}
          <button type="button" onClick={() => setMovedNote(null)} aria-label="Đóng">×</button>
        </p>
      )}
      <DndContext
        sensors={drag.sensors}
        collisionDetection={collision}
        // Ô chuyển ngày chỉ hiện ra sau khi bắt đầu kéo: luôn đo lại vị trí để thả trúng
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }} onDragStart={drag.onDragStart} onDragEnd={drag.onDragEnd} onDragCancel={drag.onDragCancel}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ul className={styles.list}>
            {blocks.map((block, index) => {
              const base = baseById.get(block.id);
              return (
                <SortableRow
                  key={block.id}
                  block={block}
                  memberCount={draft.memberCount}
                  kind={draft.kindById.get(block.id)}
                  oldTime={base && base.day === block.day && base.time !== block.time ? base.time : undefined}
                  lifted={drag.activeId === block.id}
                  demo={demo && index === 0}
                  onSelect={() => !drag.wasJustDropped() && setEditing(block)}
                />
              );
            })}
          </ul>
        </SortableContext>
        {drag.activeId && (
          <div className={styles.dropBar}>
            <span className={styles.dropTitle}>Thả vào để chuyển sang ngày khác</span>
            <div className={styles.dropZones}>
              {TRIP_DAYS.filter((d) => d.value !== day).map((d) => (
                <DayDropZone key={d.value} day={d.value} label={d.label} count={draft.dayBlocks(d.value).length} />
              ))}
            </div>
          </div>
        )}
      </DndContext>

      {draft.deletedOfDay(day).map((block) => (
        <ScheduleBlock
          key={block.id}
          block={block}
          memberCount={draft.memberCount}
          tone="deleted"
          badge={<Badge kind="deleted">Xoá</Badge>}
          trailing={<Button variant="ghost" size="sm" onClick={() => draft.restoreBlock(block.id)}>Hoàn tác</Button>}
        />
      ))}

      <button type="button" className={styles.add} onClick={() => setAdding(true)}>
        <Icon name="plus" size={18} /> Thêm mốc vào ngày {day}
      </button>

      <BlockEditorSheet
        open={Boolean(editing) || adding}
        block={editing}
        defaultDay={day}
        memberCount={draft.memberCount}
        onClose={() => { setEditing(null); setAdding(false); }}
        onSave={(b) => (editing ? draft.updateBlock(b) : draft.addBlock(b))}
        existing={draft.blocks}
        onEditExisting={(b) => { setAdding(false); setEditing(b); }}
        onDelete={draft.removeBlock}
      />
    </>
  );
}
