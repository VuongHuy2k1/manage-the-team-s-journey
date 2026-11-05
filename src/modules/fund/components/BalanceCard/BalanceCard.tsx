import { MoneyText } from '@/modules/ui-core';
import styles from './BalanceCard.module.scss';
import type { BalanceCardProps } from './BalanceCard.type';

export function BalanceCard({ balance, updatedText, contributed, spent, action }: BalanceCardProps) {
  return (
    <section className={styles.card} aria-label="Số dư quỹ">
      <div className={styles.top}>
        <div className={styles.main}>
          <span className={styles.label}>Số dư quỹ hiện tại</span>
          <MoneyText value={balance} size={26} tone={balance < 0 ? 'danger' : 'default'} />
          <span className={styles.updated}>{updatedText} · tự trừ khi xác nhận mốc</span>
        </div>
        {action}
      </div>
      <div className={styles.foot}>
        <span>Đã góp <MoneyText value={contributed} /></span>
        <span>Đã chi <MoneyText value={spent} tone="danger" /></span>
      </div>
    </section>
  );
}
