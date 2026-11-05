'use client';

import Link from 'next/link';
import { ROUTES } from '@/core/config/routes.config';
import { formatWhen } from '@/core/utils/time.utils';
import { RoleTag } from '@/modules/member';
import { AppHeader, Button, FormField, Icon, Input, cx } from '@/modules/ui-core';
import type { IconName } from '@/modules/ui-core';
import { AvatarPicker } from '../../components/AvatarPicker/AvatarPicker';
import { useMyAccount } from '../../hooks/useMyAccount.hook';
import styles from './MyAccountScreen.module.scss';

function LinkRow({ href, icon, title, sub }: { href: string; icon: IconName; title: string; sub: string }) {
  return (
    <Link href={href} className={styles.linkRow}>
      <span className={styles.linkIcon}><Icon name={icon} size={20} /></span>
      <span className={styles.linkText}>
        <span className={styles.linkTitle}>{title}</span>
        <span className={styles.linkSub}>{sub}</span>
      </span>
      <Icon name="arrow-right" size={18} className={styles.chevron} />
    </Link>
  );
}

export function MyAccountScreen() {
  const a = useMyAccount();
  if (!a.me) return null;

  return (
    <>
      <AppHeader variant="plain" backHref={ROUTES.schedule} title="Tài khoản của tôi" />
      <main className={styles.main}>
        <section className={styles.card} aria-label="Hồ sơ">
          <AvatarPicker id="my-avatar" name={a.me.name} color={a.me.color} src={a.me.avatar} onPick={a.changeAvatar} onRemove={a.removeAvatar} disabled={a.saving} />
          <div className={styles.roleRow}>
            {a.isLeader ? <RoleTag /> : <RoleTag label="Thành viên" tone="soft" />}
            {a.me.joinedAt && <span className={styles.muted}>Vào nhóm {formatWhen(a.me.joinedAt).toLowerCase()}</span>}
          </div>
          <FormField label="Tên hiển thị" htmlFor="my-name">
            <div className={styles.nameRow}>
              <Input id="my-name" value={a.name} maxLength={40} onChange={(e) => a.setName(e.target.value)} />
              {a.nameChanged && <Button variant="primary" onClick={a.saveName} loading={a.saving}>Lưu</Button>}
            </div>
          </FormField>
          <div className={styles.info}>
            <span className={styles.muted}>Đăng nhập bằng Google</span>
            <span className={styles.email}>{a.me.email}</span>
          </div>
          {a.message && <p className={cx(styles.message, a.message.tone === 'error' && styles.messageError)} role="status">{a.message.text}</p>}
        </section>

        <section className={styles.links} aria-label="Nhóm">
          <LinkRow href={ROUTES.members} icon="users" title="Thành viên trong nhóm" sub={a.isLeader ? `${a.memberCount} người · xem và xoá thành viên` : `${a.memberCount} người`} />
          <LinkRow href={ROUTES.location} icon="pin" title="Chia sẻ vị trí" sub="Bật để cả nhóm biết bạn đang ở đâu" />
          {a.isLeader && <LinkRow href={ROUTES.reset} icon="trash" title="Dọn dữ liệu thử" sub="Xoá lịch sử, giao dịch chạy thử trước khi dùng thật" />}
          {!a.isLeader && <LinkRow href={`${ROUTES.enter}?role=leader&next=${ROUTES.account}`} icon="lock" title="Nhập mã nhóm trưởng" sub="Nhận quyền duyệt lịch, quản lý quỹ" />}
        </section>

        <Button size="lg" block icon="logout" onClick={a.signOut}>Đăng xuất</Button>
      </main>
    </>
  );
}
