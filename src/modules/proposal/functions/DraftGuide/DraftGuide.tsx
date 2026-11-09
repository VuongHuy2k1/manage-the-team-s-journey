'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, Icon, cx } from '@/modules/ui-core';
import styles from './DraftGuide.module.scss';
import type { DraftGuideProps } from './DraftGuide.type';

type Scene = 'reorder' | 'day' | 'edit' | 'send';

const STEPS: { scene: Scene; title: string; text: string }[] = [
  { scene: 'reorder', title: 'Nhấn giữ rồi kéo để đổi thứ tự', text: 'Chạm giữ thẻ khoảng nửa giây đến khi thẻ nổi lên, rồi kéo lên hoặc xuống. Giờ của các khung được giữ nguyên, chỉ đổi mốc cho nhau.' },
  { scene: 'day', title: 'Kéo sang ngày khác', text: 'Trong lúc kéo, phía dưới hiện ô “Ngày 1 / 2 / 3”. Thả thẻ vào ô đó để chuyển mốc sang ngày khác.' },
  { scene: 'edit', title: 'Chạm nhanh để sửa, hoặc thêm mốc', text: 'Chạm vào thẻ để sửa tên, giờ, địa chỉ, chi phí. Chọn giờ trùng mốc đang có, app sẽ gợi ý sửa mốc đó thay vì tạo mới.' },
  { scene: 'send', title: 'So sánh rồi gửi nhóm trưởng duyệt', text: 'Bản nháp chỉ mình bạn thấy. Bấm “So sánh với lịch gốc” để xem lại thay đổi và gửi yêu cầu cho nhóm trưởng.' },
];

function Illustration({ scene }: { scene: Scene }) {
  return (
    <div className={cx(styles.stage, styles[scene])} aria-hidden="true">
      {scene === 'day' && (
        <div className={styles.zones}>
          <span className={styles.zone}>Ngày 2</span>
          <span className={styles.zone}>Ngày 3</span>
        </div>
      )}
      <div className={styles.cards}>
        <span className={cx(styles.card, styles.cardA)}><b>08:00</b> Bánh căn Nhà Chung</span>
        <span className={cx(styles.card, styles.cardB)}><b>09:30</b> Cafe Tùng</span>
        {scene !== 'day' && <span className={cx(styles.card, styles.cardC)}><b>11:00</b> Ga Đà Lạt</span>}
      </div>
      {scene === 'edit' && <span className={styles.sheet}><span /><span /><span /></span>}
      {scene === 'send' && <span className={styles.sendBtn}>So sánh với lịch gốc →</span>}
      <span className={styles.finger}>
        <svg viewBox="0 0 24 24" width="30" height="30"><path d="M9 11V5a1.5 1.5 0 0 1 3 0v5m0-1a1.5 1.5 0 0 1 3 0v1m0 0a1.5 1.5 0 0 1 3 0v4a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4.3 14a1.5 1.5 0 0 1 2.4-1.8L9 15" fill="#fff" stroke="#14213D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className={styles.ripple} />
      </span>
    </div>
  );
}

/** Popup hướng dẫn dùng tính năng đề xuất đổi lịch */
export function DraftGuide({ open, dontShow, onDontShowChange, onClose }: DraftGuideProps) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return createPortal(
    <div className={styles.overlay} role="presentation">
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="draft-guide-title">
        <div className={styles.top}>
          <span className={styles.badge}>Hướng dẫn · {step + 1}/{STEPS.length}</span>
          <button type="button" className={styles.skip} onClick={onClose}>Bỏ qua</button>
        </div>
        <Illustration key={s.scene} scene={s.scene} />
        <h2 id="draft-guide-title" className={styles.title}>{s.title}</h2>
        <p className={styles.text}>{s.text}</p>
        <div className={styles.dots} aria-hidden="true">
          {STEPS.map((x, i) => (
            <span key={x.scene} className={cx(styles.dot, i === step && styles.dotOn)} />
          ))}
        </div>
        <label className={styles.check}>
          <input type="checkbox" checked={dontShow} onChange={(e) => onDontShowChange(e.target.checked)} />
          Không hiện lại hướng dẫn này
        </label>
        <div className={styles.actions}>
          {step > 0 && <Button size="lg" onClick={() => setStep(step - 1)}>Quay lại</Button>}
          <Button size="lg" variant="primary" block onClick={() => (last ? onClose() : setStep(step + 1))} icon={last ? 'check' : 'arrow-right'}>
            {last ? 'Bắt đầu' : 'Tiếp'}
          </Button>
        </div>
        <span className={styles.foot}>
          <Icon name="history" size={12} /> Xem lại bất cứ lúc nào bằng nút “?” trên đầu trang
        </span>
      </section>
    </div>,
    document.body,
  );
}
