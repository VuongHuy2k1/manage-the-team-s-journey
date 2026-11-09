'use client';

import { TRIP } from '@/core/config/trip.config';
import { RoleCard } from '@/modules/member';
import { Button, FormField, Icon, PinInput, TripLoader } from '@/modules/ui-core';
import { GoogleButton } from '../../components/GoogleButton/GoogleButton';
import { InAppBrowserNotice } from '../../components/InAppBrowserNotice/InAppBrowserNotice';
import { ProfileForm } from '../../functions/ProfileForm/ProfileForm';
import { useEntry } from '../../hooks/useEntry.hook';
import styles from './EntryScreen.module.scss';

export function EntryScreen() {
  const e = useEntry();

  return (
    <div className={styles.screen}>
      <header className={styles.hero}>
        <svg className={styles.hills} viewBox="0 0 390 120" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
          <path d="M0 120 L80 70 L140 96 L220 40 L290 84 L340 58 L390 80 L390 120 Z" fill="#FFFFFF" opacity="0.07" />
          <path d="M180 120 L210 78 L240 120 Z M236 120 L262 86 L288 120 Z M300 120 L328 72 L356 120 Z" fill="#FFFFFF" opacity="0.1" />
          <circle cx="330" cy="32" r="14" fill="#FFC93C" />
        </svg>
        <span className={styles.eyebrow}>Sổ tay hành trình nhóm</span>
        <h1 className={styles.title}>{TRIP.name}</h1>
        <p className={styles.sub}>{TRIP.route}</p>
      </header>

      <main className={styles.body}>
        {e.step === 'unconfigured' && (
          <>
            <h2 className={styles.question}>Chưa kết nối Firebase</h2>
            <p className={styles.hint}>Tạo file <code>.env.local</code> theo mẫu <code>.env.example</code> rồi chạy lại app. Xem hướng dẫn trong README.</p>
          </>
        )}

        {(e.step === 'loading' || e.step === 'done') && <TripLoader fullscreen label="Đang kiểm tra tài khoản…" />}

        {e.step === 'role' && (
          <>
            <h2 className={styles.question}>Bạn vào với vai trò nào?</h2>
            <RoleCard icon="users" title="Thành viên" description="Xem lịch, chỉ đường, đề xuất đổi lịch, bình chọn, chia sẻ vị trí." onClick={() => e.chooseRole('member')} />
            <RoleCard icon="lock" title="Nhóm trưởng" tag="Cần mã" description="Duyệt đổi lịch, nhập chi phí thực tế, quản lý quỹ và thành viên." onClick={() => e.chooseRole('leader')} />
          </>
        )}

        {e.step === 'login' && (
          <>
            <button type="button" className={styles.back} onClick={e.back}>
              <Icon name="back" size={18} /> Chọn lại vai trò
            </button>
            <h2 className={styles.question}>Đăng nhập</h2>
            <p className={styles.hint}>
              Dùng tài khoản Google. Lần đầu sẽ tự tạo tài khoản trong nhóm.
              {e.role === 'leader' && ' Sau đó nhập mã nhóm trưởng.'}
            </p>
            {e.inApp && <InAppBrowserNotice />}
            <GoogleButton onClick={e.signIn} loading={e.busy} />
            {e.error && <p className={styles.error} role="alert">{e.error}</p>}
          </>
        )}

        {e.step === 'profile' && (
          <>
            <h2 className={styles.question}>Tạo hồ sơ trong nhóm</h2>
            <ProfileForm
              initialName={e.googleProfile?.name ?? ''}
              initialAvatar={e.googleProfile?.photo ?? null}
              email={e.googleProfile?.email ?? ''}
              busy={e.busy}
              error={e.error || undefined}
              onSubmit={e.createProfile}
            />
            <button type="button" className={styles.link} onClick={e.signOut}>Dùng tài khoản Google khác</button>
          </>
        )}

        {e.step === 'passcode' && (
          <>
            <h2 className={styles.question}>Nhập mã nhóm trưởng</h2>
            <p className={styles.hint}>Mã gồm {e.passcodeLength} số, được kiểm tra trên server. Chỉ cần nhập một lần.</p>
            <FormField label="Mã nhóm trưởng" htmlFor="leader-code" error={e.error || undefined}>
              <PinInput
                id="leader-code"
                label="Mã nhóm trưởng"
                length={e.passcodeLength}
                value={e.passcode}
                onChange={e.setPasscode}
                onComplete={e.submitPasscode}
                invalid={Boolean(e.error)}
                disabled={e.locked || e.busy}
                autoFocus
              />
            </FormField>
            <Button size="lg" variant="primary" block onClick={() => e.submitPasscode()} disabled={e.locked} loading={e.busy}>
              {e.locked ? `Thử lại sau ${e.lockSeconds} giây` : e.busy ? 'Đang kiểm tra…' : 'Vào với quyền nhóm trưởng'}
            </Button>
            <button type="button" className={styles.link} onClick={e.continueAsMember}>Vào với vai trò thành viên</button>
          </>
        )}

        {e.step === 'removed' && (
          <>
            <h2 className={styles.question}>Bạn đã bị xoá khỏi nhóm</h2>
            <p className={styles.hint}>Nhóm trưởng đã xoá tài khoản này khỏi chuyến đi. Nếu nhầm, nhờ nhóm trưởng khôi phục lại.</p>
            <Button size="lg" block icon="logout" onClick={e.signOut}>Đăng xuất</Button>
          </>
        )}
      </main>
    </div>
  );
}
