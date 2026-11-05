'use client';

import { useEffect, useState } from 'react';
import { BottomSheet, Button, FormField, Input } from '@/modules/ui-core';
import { useFund } from '../../hooks/useFund.hook';
import styles from './EditMomoSheet.module.scss';
import type { EditMomoSheetProps } from './EditMomoSheet.type';

export function EditMomoSheet({ open, onClose }: EditMomoSheetProps) {
  const { fund, setMomo, uploadQr } = useFund();
  const [accountName, setAccountName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [fundLink, setFundLink] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setAccountName(fund.momo.accountName);
    setPhone(fund.momo.phone);
    setNote(fund.momo.note);
    setFundLink(fund.momo.fundLink ?? '');
    setError('');
  }, [open, fund.momo]);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      setError('');
      await uploadQr(file);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không đọc được ảnh, thử ảnh khác.');
    }
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      label="Thông tin MoMo của quỹ"
      header={<span className={styles.heading}>Tài khoản MoMo của nhóm</span>}
      footer={
        <Button size="lg" variant="primary" block onClick={async () => { if (await setMomo({ accountName: accountName.trim(), phone: phone.trim(), note: note.trim(), fundLink: fundLink.trim() })) onClose(); }}
          loadingText="Đang lưu…">
          Lưu
        </Button>
      }
    >
      <FormField label="Ảnh mã QR" htmlFor="momo-qr" error={error} hint="Chụp màn hình mã QR nhận tiền trong app MoMo rồi tải lên.">
        <div className={styles.qrRow}>
          {fund.momo.qrDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fund.momo.qrDataUrl} alt="Mã QR hiện tại" className={styles.preview} />
          )}
          <input id="momo-qr" type="file" accept="image/*" className={styles.file} onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
      </FormField>
      <FormField label="Tên tài khoản" htmlFor="momo-name">
        <Input id="momo-name" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Tên chủ tài khoản MoMo" />
      </FormField>
      <FormField label="Số điện thoại MoMo" htmlFor="momo-phone">
        <Input id="momo-phone" mono inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xx xxx xxx" />
      </FormField>
      <FormField label="Link quỹ nhóm MoMo" htmlFor="momo-link" hint="Thành viên bấm “Xem quỹ trên MoMo” để mở link này.">
        <Input id="momo-link" type="url" value={fundLink} onChange={(e) => setFundLink(e.target.value)} placeholder="https://quy.momo.vn/…" />
      </FormField>
      <FormField label="Nội dung chuyển khoản gợi ý" htmlFor="momo-note">
        <Input id="momo-note" value={note} onChange={(e) => setNote(e.target.value)} />
      </FormField>
    </BottomSheet>
  );
}
