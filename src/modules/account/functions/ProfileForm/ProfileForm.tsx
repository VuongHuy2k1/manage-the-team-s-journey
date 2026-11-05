'use client';

import { useState } from 'react';
import { readAvatar } from '@/core/utils/image.utils';
import { Button, FormField, Input } from '@/modules/ui-core';
import { AvatarPicker } from '../../components/AvatarPicker/AvatarPicker';
import styles from './ProfileForm.module.scss';
import type { ProfileFormProps } from './ProfileForm.type';

export function ProfileForm({ initialName, initialAvatar, email, busy, error, onSubmit }: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar);
  const [imageError, setImageError] = useState('');

  const pick = async (file: File) => {
    try {
      setImageError('');
      setAvatar(await readAvatar(file));
    } catch (e) {
      setImageError(e instanceof Error ? e.message : 'Không đọc được ảnh');
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, avatar });
      }}
    >
      <AvatarPicker id="profile-avatar" name={name} color="#7FB2FF" src={avatar} onPick={pick} onRemove={() => setAvatar(null)} disabled={busy} />
      {imageError && <p className={styles.error}>{imageError}</p>}
      <FormField label="Tên hiển thị trong nhóm" htmlFor="profile-name" hint="Cả nhóm sẽ thấy tên này. Sửa được sau.">
        <Input id="profile-name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Huy" />
      </FormField>
      <p className={styles.email}>Tài khoản Google: <b>{email}</b></p>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <Button type="submit" size="lg" variant="primary" block disabled={busy}>
        {busy ? 'Đang lưu…' : 'Vào nhóm'}
      </Button>
    </form>
  );
}
