import { Avatar, MoneyText } from '@/modules/ui-core';
import styles from './PayerRow.module.scss';
import type { PayerRowProps } from './PayerRow.type';

/** Một người đã ứng trước tiền cho nhóm */
export function PayerRow({ name, color, avatar, total, count }: PayerRowProps) {
  return (
    <div className={styles.row}>
      <Avatar name={name} color={color ?? '#A3C1FF'} src={avatar ?? undefined} size={30} />
      <span className={styles.text}>
        <span className={styles.name}>{name}</span>
        <span className={styles.meta}>Ứng {count} khoản</span>
      </span>
      <MoneyText value={total} weight={700} />
    </div>
  );
}
