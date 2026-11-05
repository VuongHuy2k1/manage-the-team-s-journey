'use client';

import { useEffect, useState } from 'react';
import { createId } from '@/core/utils/id.utils';
import type { Block, Category, DayNumber } from '@/modules/schedule/schedule.type';
import type { AmountUnit } from '@/modules/ui-core';

export type CostType = 'priced' | 'free' | 'unknown' | 'label';

export const COST_TYPE_OPTIONS: { value: CostType; label: string }[] = [
  { value: 'priced', label: 'Có giá' },
  { value: 'free', label: 'Miễn phí' },
  { value: 'unknown', label: 'Chưa có giá' },
  { value: 'label', label: 'Ghi chữ' },
];

function costTypeOf(block: Block | null): CostType {
  if (!block) return 'priced';
  if (block.costLabel) return 'label';
  if (!block.estimate) return 'unknown';
  return block.estimate.amount === 0 ? 'free' : 'priced';
}

/** Trạng thái form sửa / thêm một khối trong bản nháp */
export function useBlockForm(open: boolean, block: Block | null, defaultDay: DayNumber) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [day, setDay] = useState<DayNumber>(defaultDay);
  const [category, setCategory] = useState<Category>('place');
  const [address, setAddress] = useState('');
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [note, setNote] = useState('');
  const [costType, setCostType] = useState<CostType>('priced');
  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState<AmountUnit>('person');
  const [label, setLabel] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(block?.title ?? '');
    setTime(block?.time ?? '');
    setDay(block?.day ?? defaultDay);
    setCategory(block?.category ?? 'place');
    setAddress(block?.address ?? '');
    setPin(typeof block?.lat === 'number' && typeof block?.lng === 'number' ? { lat: block.lat, lng: block.lng } : null);
    setNote(block?.note ?? '');
    setCostType(costTypeOf(block));
    setAmount(block?.estimate?.amount ?? 0);
    setUnit(block?.estimate?.unit ?? 'person');
    setLabel(block?.costLabel ?? '');
    setSubmitted(false);
  }, [open, block, defaultDay]);

  const errors = {
    title: title.trim() ? undefined : 'Nhập tên mốc',
    time: /^([01]?\d|2[0-3]):[0-5]\d$/.test(time) ? undefined : 'Nhập giờ dạng 18:30',
  };
  const valid = !errors.title && !errors.time;

  const toBlock = (): Block => ({
    id: block?.id ?? createId('b'),
    day,
    time: time.padStart(5, '0'),
    title: title.trim(),
    category,
    address: address.trim(),
    mapQuery: block && block.address === address ? block.mapQuery : undefined,
    lat: pin?.lat,
    lng: pin?.lng,
    note: note.trim() || undefined,
    estimate: costType === 'priced' ? { amount, unit } : costType === 'free' ? { amount: 0, unit: 'person' } : null,
    costLabel: costType === 'label' ? label.trim() || 'Tự túc' : undefined,
  });

  return {
    isNew: !block,
    fields: { title, time, day, category, address, pin, note, costType, amount, unit, label },
    set: { setTitle, setTime, setDay, setCategory, setAddress, setPin, setNote, setCostType, setAmount, setUnit, setLabel },
    pickPlace: (place: { lat: number; lng: number; address: string }) => {
      setPin({ lat: place.lat, lng: place.lng });
      if (place.address) setAddress(place.address);
    },
    errors: (submitted ? errors : {}) as { title?: string; time?: string },
    /** Trả về khối nếu hợp lệ, không thì bật hiển thị lỗi */
    submit: (): Block | null => {
      setSubmitted(true);
      return valid ? toBlock() : null;
    },
  };
}
