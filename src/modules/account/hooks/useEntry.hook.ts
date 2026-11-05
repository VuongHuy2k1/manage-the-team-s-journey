'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { becomeLeader, currentGoogleProfile, joinTrip, signInWithGoogle, signOutAccount } from '@/core/api/account.api';
import { ROUTES } from '@/core/config/routes.config';
import { useSyncMeta } from '@/core/hooks/useTripState.hook';
import type { EntryRole, EntryStep, ProfileDraft } from '../account.type';
import { authErrorMessage, isPermissionDenied } from '../utils/authError.utils';
import { isInAppBrowser } from '../utils/browser.utils';

const PASSCODE_LENGTH = 6;
const MAX_ATTEMPTS = 5;
const LOCK_MS = 30_000;

/** Luồng vào web: chọn vai trò → đăng nhập Google → tạo hồ sơ (lần đầu) → nhập mã nhóm trưởng (nếu chọn) */
export function useEntry() {
  const meta = useSyncMeta();
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<EntryRole | null>(params.get('role') === 'leader' ? 'leader' : null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [passcode, setPasscode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [inApp, setInApp] = useState(false);

  useEffect(() => setInApp(isInAppBrowser(navigator.userAgent)), []);

  const step: EntryStep = useMemo(() => {
    if (!meta.configured) return 'unconfigured';
    if (meta.auth === 'loading') return 'loading';
    if (meta.auth === 'signedOut') return role ? 'login' : 'role';
    if (meta.membership === 'unknown') return 'loading';
    if (meta.membership === 'removed') return 'removed';
    if (meta.membership === 'none') return 'profile';
    if (role === 'leader' && meta.me?.role !== 'leader') return 'passcode';
    return 'done';
  }, [meta, role]);

  useEffect(() => {
    if (step !== 'done') return;
    const next = params.get('next');
    router.replace(next && next.startsWith('/') && !next.startsWith(ROUTES.enter) ? next : ROUTES.schedule);
  }, [step, params, router]);

  const locked = lockedUntil > now;
  useEffect(() => {
    if (!locked) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [locked]);

  const guard = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (e) {
      const message = authErrorMessage(e);
      if (message) setError(message);
    } finally {
      setBusy(false);
    }
  };

  const google = currentGoogleProfile();

  return {
    step,
    role,
    chooseRole: (r: EntryRole) => { setRole(r); setError(''); },
    back: () => { setRole(null); setError(''); setPasscode(''); },
    busy,
    error,
    inApp,
    googleProfile: google,
    signIn: () => guard(signInWithGoogle),
    signOut: () => guard(signOutAccount),
    createProfile: (profile: ProfileDraft) => {
      if (!profile.name.trim()) {
        setError('Nhập tên hiển thị của bạn.');
        return;
      }
      return guard(() => joinTrip(profile));
    },
    passcode,
    passcodeLength: PASSCODE_LENGTH,
    setPasscode: (v: string) => { setPasscode(v); if (!locked) setError(''); },
    locked,
    lockSeconds: Math.max(0, Math.ceil((lockedUntil - now) / 1000)),
    submitPasscode: async (code = passcode) => {
      if (locked || busy) return;
      if (code.length < PASSCODE_LENGTH) {
        setError(`Nhập đủ ${PASSCODE_LENGTH} số.`);
        return;
      }
      setBusy(true);
      setError('');
      try {
        await becomeLeader(code);
      } catch (e) {
        setPasscode('');
        if (!isPermissionDenied(e)) {
          setError(authErrorMessage(e) ?? 'Có lỗi xảy ra.');
        } else {
          const used = attempts + 1;
          if (used >= MAX_ATTEMPTS) {
            setAttempts(0);
            setLockedUntil(Date.now() + LOCK_MS);
            setNow(Date.now());
            setError(`Sai quá ${MAX_ATTEMPTS} lần. Thử lại sau ${LOCK_MS / 1000} giây.`);
          } else {
            setAttempts(used);
            setError(`Mã không đúng. Còn ${MAX_ATTEMPTS - used} lần thử.`);
          }
        }
      } finally {
        setBusy(false);
      }
    },
    continueAsMember: () => setRole('member'),
  };
}
