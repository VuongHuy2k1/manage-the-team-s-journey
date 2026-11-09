'use client';

import { useState } from 'react';
import { ROUTES } from '@/core/config/routes.config';
import { TRIP_DAYS } from '@/modules/schedule/utils/schedule.utils';
import type { DayNumber } from '@/modules/schedule/schedule.type';
import { AppHeader, Badge, Button, ConfirmDialog, DayTabs, MoneyText, useDisclosure } from '@/modules/ui-core';
import { DraftBoard } from '../../functions/DraftBoard/DraftBoard';
import { DraftGuide } from '../../functions/DraftGuide/DraftGuide';
import { useDraftGuide } from '../../hooks/useDraftGuide.hook';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { useDraft } from '../../hooks/useDraft.hook';
import styles from './DraftScreen.module.scss';

export function DraftScreen() {
  const draft = useDraft();
  const { currentMemberId } = useTripState();
  const guide = useDraftGuide(currentMemberId);
  const [day, setDay] = useState<Exclude<DayNumber, 0>>(1);
  const discardDialog = useDisclosure();
  const count = draft.changes.length;

  return (
    <>
      <AppHeader
        variant="plain"
        backHref={ROUTES.schedule}
        title="Bản nháp của bạn"
        eyebrow="Tự lưu trên máy, chỉ mình bạn thấy"
        aside={
          <span className={styles.aside}>
            <button type="button" className={styles.help} onClick={guide.show} aria-label="Xem hướng dẫn">?</button>
            <Badge kind="draft">Nháp</Badge>
          </span>
        }
      >
        <DayTabs tone="onLight" value={day} onChange={(d) => setDay(d as Exclude<DayNumber, 0>)} options={TRIP_DAYS.map((d) => ({ ...d, dot: draft.dayHasChanges(d.value) }))} />
      </AppHeader>

      <main className={styles.main}>
        {draft.isOutdated && (
          <p className={styles.outdated}>Lịch chính thức đã được cập nhật sau khi bạn tạo nháp. Khi gửi, nhóm trưởng sẽ thấy nếu có chỗ trùng.</p>
        )}
        <DraftBoard day={day} onDayChange={setDay} demo={guide.demo} />
      </main>

      <footer className={styles.bar}>
        <div className={styles.barInfo}>
          <span><b>{count} thay đổi</b> so với lịch gốc</span>
          <span>
            Dự tính{' '}
            {draft.costDelta === 0 ? <b>không đổi</b> : <b className={styles.delta}><MoneyText value={draft.costDelta} format="k" signed /> / người</b>}
          </span>
        </div>
        <div className={styles.barActions}>
          <Button size="lg" onClick={discardDialog.open} disabled={!draft.hasDraft}>Bỏ nháp</Button>
          <Button size="lg" variant="primary" block href={count > 0 ? ROUTES.compare : undefined} disabled={count === 0} icon={count > 0 ? 'arrow-right' : undefined}>
            So sánh với lịch gốc
          </Button>
        </div>
      </footer>

      <DraftGuide open={guide.open} dontShow={guide.dontShow} onDontShowChange={guide.setDontShow} onClose={guide.close} />

      <ConfirmDialog
        open={discardDialog.isOpen}
        onClose={discardDialog.close}
        icon="trash"
        iconTone="warn"
        title="Bỏ bản nháp?"
        subtitle={`${count} thay đổi chưa gửi sẽ mất.`}
        actions={
          <>
            <Button size="lg" onClick={discardDialog.close}>Giữ lại</Button>
            <Button size="lg" variant="danger" onClick={() => { draft.discard(); discardDialog.close(); }}>Bỏ nháp</Button>
          </>
        }
      />
    </>
  );
}
