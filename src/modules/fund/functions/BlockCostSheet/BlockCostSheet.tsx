'use client';

import { useEffect, useState } from 'react';
import { positionText } from '@/modules/schedule/utils/schedule.utils';
import { AmountInput, BottomSheet, Button, ConfirmDialog, FormField, Input, MoneyText, type AmountUnit } from '@/modules/ui-core';
import styles from './BlockCostSheet.module.scss';
import type { BlockCostSheetProps } from './BlockCostSheet.type';

/** Nhóm trưởng sửa nhanh tên và chi phí một mục trong lịch trình */
export function BlockCostSheet({ open, onClose, block, memberCount, onSave, onDelete, completed }: BlockCostSheetProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState<AmountUnit>('person');
  const [costLabel, setCostLabel] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [askDelete, setAskDelete] = useState(false);

  useEffect(() => {
    if (!open || !block) return;
    setTitle(block.title);
    setAmount(block.estimate?.amount ?? 0);
    setUnit(block.estimate?.unit ?? 'person');
    setCostLabel(block.costLabel ?? '');
    setError('');
    setAskDelete(false);
  }, [open, block]);

  const n = Math.max(1, memberCount);
  const group = unit === 'group' ? amount : amount * n;
  const per = unit === 'person' ? amount : Math.round(amount / n);

  const submit = async () => {
    if (!title.trim()) return setError('Nhập tên mục.');
    setBusy(true);
    const ok = await onSave({
      title,
      estimate: amount > 0 || !costLabel.trim() ? { amount, unit } : null,
      costLabel,
    });
    setBusy(false);
    if (ok) onClose();
  };

  return (
    <>
    <BottomSheet
      open={open}
      onClose={onClose}
      label="Sửa chi phí mục lịch trình"
      header={
        <span className={styles.header}>
          <span className={styles.heading}>Sửa chi phí</span>
          {block && <span className={styles.pos}>{positionText(block)}</span>}
        </span>
      }
      footer={
        <div className={styles.actions}>
          {onDelete && !completed && (
            <Button size="lg" variant="danger" icon="trash" onClick={() => setAskDelete(true)} disabled={busy}>
              Xoá
            </Button>
          )}
          <Button size="lg" variant="primary" block onClick={submit} loading={busy}>
            {busy ? 'Đang lưu…' : 'Lưu vào lịch trình'}
          </Button>
        </div>
      }
    >
      <FormField label="Tên mục" htmlFor="bc-title" error={error || undefined}>
        <Input id="bc-title" value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} />
      </FormField>
      <FormField
        label="Chi phí dự tính"
        htmlFor="bc-amount"
        hint={amount > 0 ? <>Cả nhóm <MoneyText value={group} /> · <MoneyText value={per} /> mỗi người</> : 'Để 0 nếu miễn phí'}
      >
        <AmountInput id="bc-amount" value={amount} unit={unit} onValueChange={setAmount} onUnitChange={setUnit} large />
      </FormField>
      <FormField label="Nhãn thay giá (tuỳ chọn)" htmlFor="bc-label" hint="Ví dụ “Tự túc”, “Đã tính tiền nhà”. Chỉ hiện khi chi phí là 0.">
        <Input id="bc-label" value={costLabel} maxLength={30} onChange={(e) => setCostLabel(e.target.value)} />
      </FormField>
      <p className={styles.hint}>
        Thay đổi được áp dụng ngay và ghi vào lịch sử thay đổi lịch trình.
        {completed && ' Mục đã hoàn thành nên không xoá được, hoàn tác ở trang Đã xong trước nếu cần.'}
      </p>
    </BottomSheet>
      <ConfirmDialog
        open={askDelete}
        onClose={() => setAskDelete(false)}
        icon="trash"
        iconTone="warn"
        title={`Xoá “${block?.title ?? ''}” khỏi lịch trình?`}
        subtitle="Mục này sẽ bị bỏ khỏi lịch và tổng dự tính. Có thể khôi phục lại ở Lịch sử thay đổi."
        actions={
          <>
            <Button size="lg" onClick={() => setAskDelete(false)}>Huỷ</Button>
            <Button
              size="lg"
              variant="danger"
              loadingText="Đang xoá…"
              onClick={async () => {
                if (onDelete && (await onDelete())) {
                  setAskDelete(false);
                  onClose();
                }
              }}
            >
              Xoá
            </Button>
          </>
        }
      />
    </>
  );
}
