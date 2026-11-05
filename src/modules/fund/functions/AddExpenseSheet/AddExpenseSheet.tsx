'use client';

import { useEffect, useState } from 'react';
import {
  AmountInput,
  Avatar,
  BottomSheet,
  Button,
  FormField,
  Input,
  MoneyText,
  SegmentedControl,
  StatRow,
  type AmountUnit,
} from '@/modules/ui-core';
import type { ExpensePayMethod } from '../../fund.type';
import styles from './AddExpenseSheet.module.scss';
import type { AddExpenseSheetProps } from './AddExpenseSheet.type';

const PAY_OPTIONS: { value: ExpensePayMethod; label: string }[] = [
  { value: 'fund', label: 'Quỹ chung' },
  { value: 'advance', label: 'Có người ứng' },
  { value: 'self', label: 'Ai nấy trả' },
];

export function AddExpenseSheet({ open, onClose, onAdd, members, meId, fundBalance, initial }: AddExpenseSheetProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState<AmountUnit>('group');
  const [payMethod, setPayMethod] = useState<ExpensePayMethod>('fund');
  const [paidBy, setPaidBy] = useState(meId);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? '');
    setAmount(initial?.amount ?? 0);
    setUnit('group');
    setPayMethod('fund');
    setPaidBy(meId);
    setNote('');
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, meId]);

  const n = Math.max(1, members.length);
  const total = unit === 'group' ? amount : amount * n;

  const submit = async () => {
    if (!title.trim()) return setError('Nhập tên khoản chi.');
    if (total <= 0) return setError('Nhập số tiền.');
    setBusy(true);
    const ok = await onAdd({ title, amount: total, payMethod, paidBy, note, plannedId: initial?.plannedId });
    setBusy(false);
    if (ok) onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      label="Thêm khoản chi ngoài lịch trình"
      header={<span className={styles.heading}>{initial ? 'Ghi đã chi khoản dự tính' : 'Khoản chi ngoài lịch trình'}</span>}
      footer={
        <Button size="lg" variant="primary" block onClick={submit} loading={busy}>
          {busy ? 'Đang lưu…' : payMethod === 'fund' ? 'Lưu & trừ quỹ' : 'Lưu khoản chi'}
        </Button>
      }
    >
      <FormField label="Chi cho việc gì" htmlFor="exp-title" error={error && !title.trim() ? error : undefined}>
        <Input id="exp-title" value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} placeholder="Ví dụ: Mua nước, thuốc, gửi xe" />
      </FormField>
      <FormField label="Số tiền" htmlFor="exp-amount" hint={total > 0 ? <>Cả nhóm <MoneyText value={total} /> · <MoneyText value={Math.round(total / n)} /> mỗi người</> : undefined} error={error && title.trim() ? error : undefined}>
        <AmountInput id="exp-amount" value={amount} unit={unit} onValueChange={setAmount} onUnitChange={setUnit} large />
      </FormField>
      <FormField label="Trả bằng">
        <SegmentedControl options={PAY_OPTIONS} value={payMethod} onChange={setPayMethod} ariaLabel="Trả bằng" wrap />
      </FormField>
      {payMethod === 'advance' && (
        <FormField label="Ai ứng trước?">
          <div className={styles.people}>
            {members.map((m) => (
              <button key={m.id} type="button" className={styles.person} aria-pressed={paidBy === m.id} onClick={() => setPaidBy(m.id)}>
                <Avatar name={m.name} color={m.color} src={m.avatar} size={36} selected={paidBy === m.id} />
                <span>{m.name.split(' ').pop()}</span>
              </button>
            ))}
          </div>
        </FormField>
      )}
      {payMethod === 'fund' && total > 0 && (
        <div className={styles.fund}>
          <StatRow label="Quỹ hiện có" value={<MoneyText value={fundBalance} weight={500} />} />
          <StatRow label="Trừ khoản này" value={<MoneyText value={-total} signed tone="danger" weight={500} />} />
          <StatRow label="Quỹ còn lại" value={<MoneyText value={fundBalance - total} tone={fundBalance - total < 0 ? 'danger' : 'default'} />} strong divider />
        </div>
      )}
      <FormField label="Ghi chú (tuỳ chọn)" htmlFor="exp-note">
        <Input id="exp-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ví dụ: tiệm thuốc gần chợ" />
      </FormField>
    </BottomSheet>
  );
}
