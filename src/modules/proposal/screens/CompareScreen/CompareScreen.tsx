'use client';

import { useState } from 'react';
import { ROUTES } from '@/core/config/routes.config';
import { useMembers } from '@/modules/member';
import { AppHeader, Button, FormField, Input } from '@/modules/ui-core';
import { CompareView } from '../../functions/CompareView/CompareView';
import type { CompareMode } from '../../functions/CompareView/CompareView.type';
import { useDiff } from '../../hooks/useDiff.hook';
import styles from './CompareScreen.module.scss';

export function CompareScreen() {
  const diff = useDiff();
  const { leaders } = useMembers();
  const [mode, setMode] = useState<CompareMode>('changes');
  const [reason, setReason] = useState('');
  const hasChanges = diff.changes.length > 0;

  return (
    <>
      <AppHeader variant="plain" backHref={ROUTES.draft} title="So sánh với lịch gốc" />
      <main className={styles.main}>
        <CompareView mode={mode} onModeChange={setMode} />
        {hasChanges && (
          <FormField label="Lý do gửi kèm" htmlFor="reason">
            <Input id="reason" multiline rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ví dụ: Crazy House hay đông, đổi sang chỗ khác cho thoáng." />
          </FormField>
        )}
      </main>
      {hasChanges && (
        <footer className={styles.bar}>
          <span className={styles.note}>
            Cả nhóm sẽ thấy và bình chọn. Lịch chính thức chỉ đổi khi nhóm trưởng {leaders.map((l) => l.name).join(', ')} duyệt.
          </span>
          <Button size="lg" variant="accent" block onClick={() => diff.submit(reason)} loadingText="Đang gửi yêu cầu…">
            Gửi yêu cầu cho nhóm trưởng
          </Button>
        </footer>
      )}
    </>
  );
}
