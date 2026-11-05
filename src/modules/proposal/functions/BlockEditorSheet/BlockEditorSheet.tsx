'use client';

import { useState } from 'react';
import { PlacePicker } from '@/modules/schedule/functions/PlacePicker/PlacePicker';
import { CATEGORY_OPTIONS, TRIP_DAYS } from '@/modules/schedule/utils/schedule.utils';
import type { Category, DayNumber } from '@/modules/schedule/schedule.type';
import {
  AmountInput,
  Badge,
  BottomSheet,
  Icon,
  Button,
  FormField,
  Input,
  MoneyText,
  SegmentedControl,
  splitPerPerson,
} from '@/modules/ui-core';
import { COST_TYPE_OPTIONS, useBlockForm } from '../../hooks/useBlockForm.hook';
import styles from './BlockEditorSheet.module.scss';
import type { BlockEditorSheetProps } from './BlockEditorSheet.type';

export function BlockEditorSheet({ open, block, defaultDay, memberCount, onClose, onSave, onDelete }: BlockEditorSheetProps) {
  const form = useBlockForm(open, block, defaultDay);
  const { fields: f, set, errors } = form;
  const [picking, setPicking] = useState(false);

  const save = () => {
    const next = form.submit();
    if (!next) return;
    onSave(next);
    onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      label={form.isNew ? 'Thêm mốc mới' : `Sửa ${block?.title ?? 'mốc'}`}
      header={<Badge kind="draft">{form.isNew ? 'Thêm vào bản nháp' : 'Sửa trong bản nháp'}</Badge>}
      footer={
        <>
          {!form.isNew && onDelete && block && (
            <Button size="lg" variant="danger" icon="trash" onClick={() => { onDelete(block.id); onClose(); }}>
              Xoá
            </Button>
          )}
          <Button size="lg" variant="primary" block onClick={save}>
            Lưu vào bản nháp
          </Button>
        </>
      }
    >
      <FormField label="Tên mốc" htmlFor="f-title" error={errors.title}>
        <Input id="f-title" value={f.title} onChange={(e) => set.setTitle(e.target.value)} placeholder="Ví dụ: Lẩu gà lá é" invalid={!!errors.title} />
      </FormField>

      <div className={styles.grid}>
        <FormField label="Giờ" htmlFor="f-time" error={errors.time}>
          <Input id="f-time" type="time" mono value={f.time} onChange={(e) => set.setTime(e.target.value)} invalid={!!errors.time} />
        </FormField>
        <FormField label="Ngày" htmlFor="f-day">
          <select id="f-day" className={styles.select} value={f.day} onChange={(e) => set.setDay(Number(e.target.value) as DayNumber)}>
            {TRIP_DAYS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Loại">
        <SegmentedControl options={CATEGORY_OPTIONS} value={f.category} onChange={(v) => set.setCategory(v as Category)} ariaLabel="Loại mốc" wrap />
      </FormField>

      <FormField
        label="Địa chỉ"
        htmlFor="f-address"
        hint={
          f.pin ? (
            <span className={styles.pinned}>
              <Icon name="pin" size={14} /> Đã ghim trên bản đồ, chỉ đường sẽ tới đúng chỗ này
              <button type="button" className={styles.unpin} onClick={() => set.setPin(null)}>Bỏ ghim</button>
            </span>
          ) : (
            'Chọn trên bản đồ để chỉ đường chính xác'
          )
        }
      >
        <div className={styles.addressRow}>
          <Input id="f-address" value={f.address} onChange={(e) => set.setAddress(e.target.value)} placeholder="Số nhà, đường, Đà Lạt" />
          <Button icon="pin" onClick={() => setPicking(true)} aria-label="Chọn trên bản đồ">Bản đồ</Button>
        </div>
      </FormField>

      <FormField
        label="Chi phí dự tính"
        hint={
          f.costType === 'priced' && f.unit === 'group' ? (
            <>= <MoneyText value={splitPerPerson(f.amount, memberCount)} /> mỗi người (chia {memberCount})</>
          ) : undefined
        }
      >
        <SegmentedControl options={COST_TYPE_OPTIONS} value={f.costType} onChange={set.setCostType} ariaLabel="Kiểu chi phí" wrap />
        {f.costType === 'priced' && (
          <AmountInput id="f-amount" value={f.amount} unit={f.unit} onValueChange={set.setAmount} onUnitChange={set.setUnit} />
        )}
        {f.costType === 'label' && (
          <Input id="f-label" aria-label="Chữ hiển thị thay cho số tiền" value={f.label} onChange={(e) => set.setLabel(e.target.value)} placeholder="Ví dụ: Tự túc, Đã tính tiền nhà" />
        )}
      </FormField>

      <FormField label="Ghi chú" htmlFor="f-note">
        <Input id="f-note" multiline rows={2} value={f.note} onChange={(e) => set.setNote(e.target.value)} placeholder="Ví dụ: Gọi đặt bàn trước" />
      </FormField>
      <PlacePicker
        open={picking}
        onClose={() => setPicking(false)}
        onPick={form.pickPlace}
        initial={{ lat: f.pin?.lat, lng: f.pin?.lng, address: f.address, query: f.pin ? '' : f.title }}
      />
    </BottomSheet>
  );
}
