import { Button, Icon, cx } from '@/modules/ui-core';
import styles from './ShareCard.module.scss';
import type { ShareCardProps } from './ShareCard.type';

export function ShareCard({ sharing, updatedText, busy, errorText, sharingCount, onToggle }: ShareCardProps) {
  return (
    <section className={cx(styles.card, sharing && styles.on)} aria-label="Chia sẻ vị trí của tôi">
      <div className={styles.top}>
        <span className={styles.icon}>
          <Icon name="pin" size={22} />
          {sharing && <span className={styles.pulse} aria-hidden="true" />}
        </span>
        <div className={styles.text}>
          <span className={styles.title}>{sharing ? 'Đang chia sẻ vị trí' : 'Chưa chia sẻ vị trí'}</span>
          <span className={styles.sub}>
            {sharing ? `Cả nhóm thấy bạn${updatedText ? ` · ${updatedText}` : ''}` : `${sharingCount} người đang chia sẻ`}
          </span>
        </div>
        <Button variant={sharing ? 'secondary' : 'primary'} onClick={onToggle} loading={busy}>
          {busy ? 'Đang lấy…' : sharing ? 'Tắt' : 'Bật chia sẻ'}
        </Button>
      </div>
      {errorText && <p className={styles.error} role="alert">{errorText}</p>}
      <p className={styles.note}>Vị trí chỉ cập nhật khi web đang mở trên điện thoại. Tắt bất cứ lúc nào.</p>
    </section>
  );
}
