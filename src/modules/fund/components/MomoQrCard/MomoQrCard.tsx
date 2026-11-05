import { Icon, MoneyText } from '@/modules/ui-core';
import styles from './MomoQrCard.module.scss';
import type { MomoQrCardProps } from './MomoQrCard.type';

export function MomoQrCard({ momo, target, targetLabel, fundLink, actions, onQrClick }: MomoQrCardProps) {
  return (
    <section className={styles.card} aria-label="Góp quỹ qua MoMo">
      <div className={styles.qr}>
        {momo.qrDataUrl ? (
          <button type="button" className={styles.qrButton} onClick={onQrClick} aria-label="Phóng to mã QR">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={momo.qrDataUrl} alt="Mã QR MoMo của quỹ nhóm" className={styles.qrImg} />
            <span className={styles.zoom} aria-hidden="true"><Icon name="plus" size={14} strokeWidth={3} /></span>
          </button>
        ) : (
          <span className={styles.qrEmpty}>
            <Icon name="camera" size={22} />
            Chưa có QR
          </span>
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.brand}>Quỹ nhóm · MoMo</span>
        <span className={styles.name}>{momo.accountName || 'Chưa có tên tài khoản'}</span>
        <span className={styles.phone}>{momo.phone || 'Chưa có số điện thoại'}</span>
        <span className={styles.line}>Nội dung: <b>{momo.note}</b></span>
        <span className={styles.line}>{targetLabel ?? 'Mỗi người góp'}: <MoneyText value={target} /> / người</span>
        {fundLink && (
          <a className={styles.fundLink} href={fundLink} target="_blank" rel="noopener noreferrer">
            Xem quỹ trên MoMo <Icon name="arrow-up-right" size={16} />
          </a>
        )}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </section>
  );
}
