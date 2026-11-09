'use client';

import { useEffect, useState } from 'react';
import { AmountInput, BottomSheet, Button, FormField, Input, MoneyText, type AmountUnit, notify } from '@/modules/ui-core';
import styles from './PlannedCostSheet.module.scss';
import type { PlannedCostSheetProps } from './PlannedCostSheet.type';

export function PlannedCostSheet({ open, onClose, item, memberCount, onSave, onDelete }: PlannedCostSheetProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState<AmountUnit>('group');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(item?.title ?? '');
    setAmount(item?.amount ?? 0);
    setUnit('group');
    setNote(item?.note ?? '');
    setError('');
  }, [open, item]);

  const n = Math.max(1, memberCount);
  const total = unit === 'group' ? amount : amount * n;

  const submit = async () => {
    if (!title.trim()) return setError('Nhập tên khoản.');
    setBusy(true);
    const ok = await onSave({ title, amount: total, note });
    setBusy(false);
    if (ok) {
      notify(item ? 'Đã sửa khoản dự tính' : 'Đã thêm khoản dự tính');
      onClose();
    }
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      label={item ? 'Sửa khoản dự tính' : 'Thêm khoản dự tính'}
      header={<span className={styles.heading}>{item ? 'Sửa khoản dự tính' : 'Thêm khoản dự tính'}</span>}
      footer={
        <div className={styles.actions}>
          {item && onDelete && (
            <Button size="lg" variant="danger" onClick={onDelete}>
              Xoá
            </Button>
          )}
          <Button size="lg" variant="primary" block onClick={submit} loading={busy}>
            {busy ? 'Đang lưu…' : 'Lưu dự tính'}
          </Button>
        </div>
      }
    >
      <p className={styles.hint}>Khoản ngoài lịch trình như tiền nhà, xe khứ hồi, đồ dùng chung… sẽ được cộng vào tổng dự tính.</p>
      <FormField label="Tên khoản" htmlFor="plan-title" error={error || undefined}>
        <Input id="plan-title" value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} placeholder="Ví dụ: Tiền nhà 2 đêm" />
      </FormField>
      <FormField
        label="Dự tính"
        htmlFor="plan-amount"
        hint={total > 0 ? <>Cả nhóm <MoneyText value={total} /> · <MoneyText value={Math.round(total / n)} /> mỗi người</> : undefined}
      >
        <AmountInput id="plan-amount" value={amount} unit={unit} onValueChange={setAmount} onUnitChange={setUnit} large />
      </FormField>
      <FormField label="Ghi chú (tuỳ chọn)" htmlFor="plan-note">
        <Input id="plan-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ví dụ: đã cọc 1 triệu" />
      </FormField>
    </BottomSheet>
  );
}
