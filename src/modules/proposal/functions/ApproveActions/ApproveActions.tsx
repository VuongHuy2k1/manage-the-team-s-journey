'use client';

import { useState } from 'react';
import { BottomSheet, Button, FormField, Input, useDisclosure, celebrate, notify } from '@/modules/ui-core';
import { useApprove } from '../../hooks/useApprove.hook';
import styles from './ApproveActions.module.scss';
import type { ApproveActionsProps } from './ApproveActions.type';

export function ApproveActions({ requestId, title }: ApproveActionsProps) {
  const { isLeader, approve, reject } = useApprove();
  const sheet = useDisclosure();
  const [reason, setReason] = useState('');
  if (!isLeader) return null;

  return (
    <>
      <div className={styles.row}>
        <Button size="lg" variant="danger" onClick={sheet.open}>Từ chối</Button>
        <Button size="lg" variant="primary" block onClick={async () => { if (await approve(requestId)) { celebrate({ count: 26 }); notify('Đã duyệt, lịch trình đã cập nhật'); } }} loadingText="Đang duyệt…">Duyệt & cập nhật lịch</Button>
      </div>
      <BottomSheet
        open={sheet.isOpen}
        onClose={sheet.close}
        label="Từ chối yêu cầu"
        header={<span className={styles.heading}>Từ chối “{title}”</span>}
        footer={
          <Button size="lg" variant="primary" block onClick={async () => { const ok = await reject(requestId, reason); if (ok !== false) { setReason(''); sheet.close(); } }}
            loadingText="Đang gửi…">
            Gửi lý do & từ chối
          </Button>
        }
      >
        <FormField label="Lý do (cả nhóm sẽ thấy)" htmlFor={`reject-${requestId}`}>
          <Input id={`reject-${requestId}`} multiline rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ví dụ: chợ đêm gần nhà, đi bộ được, giữ lại." />
        </FormField>
      </BottomSheet>
    </>
  );
}
