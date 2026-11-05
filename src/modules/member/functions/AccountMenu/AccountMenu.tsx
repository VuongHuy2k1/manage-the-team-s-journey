'use client';

import Link from 'next/link';
import { ROUTES } from '@/core/config/routes.config';
import { Avatar, cx } from '@/modules/ui-core';
import { useCurrentMember } from '../../hooks/useCurrentMember.hook';
import { shortName } from '../../utils/role.utils';
import styles from './AccountMenu.module.scss';
import type { AccountMenuProps } from './AccountMenu.type';

/** Nút avatar góc phải: mở trang Tài khoản của tôi */
export function AccountMenu({ tone = 'onBrand' }: AccountMenuProps) {
  const { member } = useCurrentMember();
  return (
    <Link href={ROUTES.account} className={cx(styles.trigger, styles[tone])} aria-label={`Tài khoản của tôi: ${member.name}`}>
      <Avatar name={member.name} color={member.color} src={member.avatar} size={28} />
      <span className={styles.name}>{shortName(member.name)}</span>
    </Link>
  );
}
