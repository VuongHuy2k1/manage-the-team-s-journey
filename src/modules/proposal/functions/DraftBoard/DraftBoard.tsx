'use client';

import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ScheduleBlock } from '@/modules/schedule/components/ScheduleBlock/ScheduleBlock';
import type { Block } from '@/modules/schedule/schedule.type';
import { Badge, Button, Icon, cx } from '@/modules/ui-core';
import { useDraft } from '../../hooks/useDraft.hook';
import { useDragReorder } from '../../hooks/useDragReorder.hook';
import type { ChangeKind } from '../../proposal.type';
import { BlockEditorSheet } from '../BlockEditorSheet/BlockEditorSheet';
import styles from './DraftBoard.module.scss';
import type { DraftBoardProps } from './DraftBoard.type';

const BADGE: Record<ChangeKind, string> = { moved: 'Đã dời', edited: 'Đã sửa', added: 'Mới', deleted: 'Xoá' };

interface SortableRowProps {
  block: Block;
  memberCount: number;
  kind?: ChangeKind;
  oldTime?: string;
  lifted: boolean;
  onSelect: () => void;
}

/** Cả thẻ là vùng kéo; tay nắm ⋮⋮ chỉ để gợi ý và dùng bàn phím */
function SortableRow({ block, memberCount, kind, oldTime, lifted, onSelect }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cx(styles.row, lifted && styles.lifting)}
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

export function DraftBoard({ day }: DraftBoardProps) {
  const draft = useDraft();
  const blocks = draft.dayBlocks(day);
  const ids = blocks.map((b) => b.id);
  const drag = useDragReorder(ids, (ordered) => draft.reorderDay(day, ordered));
  const [editing, setEditing] = useState<Block | null>(null);
  const [adding, setAdding] = useState(false);
  const baseById = new Map(draft.base.map((b) => [b.id, b]));

  return (
    <>
      <p className={styles.hint}>Nhấn giữ thẻ rồi kéo để đổi thứ tự · chạm nhanh để sửa</p>
      <DndContext sensors={drag.sensors} collisionDetection={closestCenter} onDragStart={drag.onDragStart} onDragEnd={drag.onDragEnd} onDragCancel={drag.onDragCancel}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ul className={styles.list}>
            {blocks.map((block) => {
              const base = baseById.get(block.id);
              return (
                <SortableRow
                  key={block.id}
                  block={block}
                  memberCount={draft.memberCount}
                  kind={draft.kindById.get(block.id)}
                  oldTime={base && base.day === block.day && base.time !== block.time ? base.time : undefined}
                  lifted={drag.activeId === block.id}
                  onSelect={() => !drag.wasJustDropped() && setEditing(block)}
                />
              );
            })}
          </ul>
        </SortableContext>
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
        onDelete={draft.removeBlock}
      />
    </>
  );
}
