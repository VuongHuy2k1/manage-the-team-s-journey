'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOutAccount, updateMyProfile } from '@/core/api/account.api';
import { ROUTES } from '@/core/config/routes.config';
import { useSyncMeta, useTripState } from '@/core/hooks/useTripState.hook';
import { readAvatar } from '@/core/utils/image.utils';
import { authErrorMessage } from '../utils/authError.utils';

export function useMyAccount() {
  const { me } = useSyncMeta();
  const { members, leaderIds } = useTripState();
  const router = useRouter();
  const [name, setName] = useState(me?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => setName(me?.name ?? ''), [me?.name]);

  const run = async (fn: () => Promise<void>, ok: string) => {
    setSaving(true);
    setMessage(null);
    try {
      await fn();
      setMessage({ tone: 'ok', text: ok });
    } catch (e) {
      setMessage({ tone: 'error', text: authErrorMessage(e) ?? 'Không lưu được.' });
    } finally {
      setSaving(false);
    }
  };

  return {
    me,
    isLeader: Boolean(me && leaderIds.includes(me.id)),
    memberCount: members.length,
    name,
    setName,
    nameChanged: Boolean(me && name.trim() && name.trim() !== me.name),
    saving,
    message,
    saveName: () => {
      if (!name.trim()) {
        setMessage({ tone: 'error', text: 'Tên không được để trống.' });
        return;
      }
      return run(() => updateMyProfile({ name: name.trim() }), 'Đã lưu tên mới');
    },
    changeAvatar: (file: File) => run(async () => updateMyProfile({ avatar: await readAvatar(file) }), 'Đã đổi ảnh đại diện'),
    removeAvatar: () => run(() => updateMyProfile({ avatar: null }), 'Đã gỡ ảnh đại diện'),
    signOut: async () => {
      await signOutAccount();
      router.replace(ROUTES.enter);
    },
  };
}
