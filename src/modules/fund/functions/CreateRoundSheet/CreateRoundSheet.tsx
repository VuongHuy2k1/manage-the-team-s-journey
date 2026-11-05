'use client';

import { useEffect, useState } from 'react';
import { BottomSheet, Button, FormField, Input, MoneyText, formatMoneyInput, parseMoney } from '@/modules/ui-core';
import styles from './CreateRoundSheet.module.scss';
import type { CreateRoundSheetProps } from './CreateRoundSheet.type';

export function CreateRoundSheet({ open, onClose, onCreate, suggestion, memberCount }: CreateRoundSheetProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(suggestion.title);
    setAmount(suggestion.amount);
    setNote(suggestion.shortage ? 'Quỹ dự kiến thiếu, mỗi người góp thêm để đủ chi phí còn lại.' : '');
    setBusy(false);
  }, [open, suggestion]);

  const submit = async () => {
    if (amount <= 0) return;
    setBusy(true);
    const ok = await onCreate({ title, amount, note });
    setBusy(false);
    if (ok) onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      label="Tạo lần nộp mới"
      header={<span className={styles.heading}>Tạo lần nộp mới</span>}
      footer={
        <Button size="lg" variant="primary" block onClick={submit} loading={busy} disabled={amount <= 0}>
          {busy ? 'Đang tạo…' : 'Tạo lần nộp'}
        </Button>
      }
    >
      {suggestion.shortage > 0 && (
        <p className={styles.hint}>
          Quỹ dự kiến thiếu <MoneyText value={suggestion.shortage} />, chia đều {memberCount} người ≈ <MoneyText value={suggestion.amount} /> / người.
        </p>
      )}
      <FormField label="Tên lần nộp" htmlFor="round-title">
        <Input id="round-title" value={title} maxLength={50} onChange={(e) => setTitle(e.target.value)} />
      </FormField>
      <FormField label="Mỗi người nộp" htmlFor="round-amount" hint={amount > 0 ? <>Cả nhóm: <MoneyText value={amount * memberCount} /></> : undefined}>
        <Input id="round-amount" mono large inputMode="numeric" value={formatMoneyInput(amount)} onChange={(e) => setAmount(parseMoney(e.target.value))} placeholder="0" />
      </FormField>
      <FormField label="Ghi chú (tuỳ chọn)" htmlFor="round-note">
        <Input id="round-note" multiline rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ví dụ: nộp trước tối thứ Sáu" />
      </FormField>
    </BottomSheet>
  );
}
