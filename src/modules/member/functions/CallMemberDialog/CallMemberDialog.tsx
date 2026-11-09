'use client';

import { useState } from 'react';
import { Avatar, Button, ConfirmDialog, Icon } from '@/modules/ui-core';
import { formatPhone, normalizePhone, telHref } from '../../utils/phone.utils';
import styles from './CallMemberDialog.module.scss';
import type { CallMemberDialogProps } from './CallMemberDialog.type';

/** Xác nhận trước khi gọi một thành viên */
export function CallMemberDialog({ member, onClose }: CallMemberDialogProps) {
  const [copied, setCopied] = useState(false);
  const phone = member?.phone ?? '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(normalizePhone(phone));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* trình duyệt không cho chép: người dùng vẫn đọc được số */
    }
  };

  return (
    <ConfirmDialog
      open={Boolean(member && phone)}
      onClose={onClose}
      icon="phone"
      iconTone="success"
      title={`Gọi ${member?.name ?? ''}?`}
      actions={
        <>
          <Button size="lg" icon={copied ? 'check' : 'copy'} onClick={copy}>
            {copied ? 'Đã chép' : 'Chép số'}
          </Button>
          <a className={styles.call} href={telHref(phone)} onClick={onClose}>
            <Icon name="phone" size={18} />
            Gọi ngay
          </a>
        </>
      }
    >
      {member && (
        <div className={styles.person}>
          <Avatar name={member.name} color={member.color} src={member.avatar} size={44} />
          <span className={styles.number}>{formatPhone(phone)}</span>
        </div>
      )}
    </ConfirmDialog>
  );
}
