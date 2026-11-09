'use client';

import { useEffect, useState } from 'react';
import { BottomSheet, Button, FormField, Input, MoneyText, formatMoneyInput, parseMoney, notify } from '@/modules/ui-core';
import { useFund } from '../../hooks/useFund.hook';
import styles from './EditBalanceSheet.module.scss';
import type { EditBalanceSheetProps } from './EditBalanceSheet.type';

export function EditBalanceSheet({ open, onClose }: EditBalanceSheetProps) {
  const { fund, setBalance } = useFund();
  const [balance, setBalanceInput] = useState(0);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) return;
    setBalanceInput(fund.balance);
    setReason('');
  }, [open, fund.balance]);

  const save = async () => {
    if (balance !== fund.balance) {
      if (!(await setBalance(balance, reason))) return;
      notify('Đã cập nhật số dư quỹ');
    }
    onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      label="Sửa số dư quỹ"
      header={<span className={styles.heading}>Cập nhật quỹ</span>}
      footer={<Button size="lg" variant="primary" block onClick={save} loadingText="Đang lưu…">Lưu</Button>}
    >
      <FormField label="Số tiền đang có trong quỹ" htmlFor="fund-balance" hint={balance !== fund.balance ? <>Chênh lệch <MoneyText value={balance - fund.balance} signed /> sẽ được ghi vào lịch sử quỹ.</> : 'Nhập đúng số dư tài khoản MoMo của nhóm lúc này.'}>
        <Input id="fund-balance" mono large inputMode="numeric" value={formatMoneyInput(balance)} onChange={(e) => setBalanceInput(parseMoney(e.target.value))} placeholder="0" />
      </FormField>
      <FormField label="Lý do (ghi vào lịch sử quỹ)" htmlFor="fund-reason">
        <Input id="fund-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ví dụ: đối chiếu số dư MoMo" />
      </FormField>
    </BottomSheet>
  );
}
