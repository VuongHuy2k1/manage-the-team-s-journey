import { withUiLock } from '@/modules/ui-core/utils/uiLock.utils';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { colorForId } from '../data/seed.data';
import { getFirebase } from '../firebase/firebase.client';
import { PATHS } from '../firebase/firebase.paths';
import { nowISO } from '../utils/id.utils';

/** Không để giao diện chờ mãi khi server không phản hồi */
function withTimeout<T>(promise: Promise<T>, ms = 15000): Promise<T> {
  return withUiLock(Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(Object.assign(new Error('timeout'), { code: 'app/timeout' })), ms),
    ),
  ]));
}

function fb() {
  const handles = getFirebase();
  if (!handles) throw Object.assign(new Error('Firebase chưa được cấu hình'), { code: 'app/not-configured' });
  return handles;
}

/** Đăng nhập (hoặc tạo tài khoản lần đầu) bằng tài khoản Google */
export async function signInWithGoogle(): Promise<void> {
  await signInWithPopup(fb().auth, new GoogleAuthProvider());
}

/** Thông tin Google của người đang đăng nhập, dùng để điền sẵn hồ sơ */
export function currentGoogleProfile(): { name: string; email: string; photo: string | null } | null {
  const user = getFirebase()?.auth.currentUser;
  if (!user) return null;
  return { name: user.displayName ?? '', email: user.email ?? '', photo: user.photoURL };
}

/** Lần đầu vào nhóm: tạo hồ sơ thành viên */
export async function joinTrip(profile: { name: string; avatar: string | null }): Promise<void> {
  const { auth, db } = fb();
  const user = auth.currentUser;
  if (!user) throw Object.assign(new Error('Chưa đăng nhập'), { code: 'auth/no-user' });
  await withTimeout(setDoc(doc(db, PATHS.member(user.uid)), {
    email: user.email ?? '',
    name: profile.name.trim(),
    avatar: profile.avatar,
    color: colorForId(user.uid),
    role: 'member',
    removed: false,
    joinedAt: nowISO(),
  }));
}

export async function signOutAccount(): Promise<void> {
  await signOut(fb().auth);
}

/** Nhận quyền nhóm trưởng: Firestore rules so mã với secrets/leader, sai mã sẽ bị từ chối */
export async function becomeLeader(passcode: string): Promise<void> {
  const { auth, db } = fb();
  const uid = auth.currentUser?.uid;
  if (!uid) throw Object.assign(new Error('Chưa đăng nhập'), { code: 'auth/no-user' });
  const batch = writeBatch(db);
  batch.set(doc(db, PATHS.leader(uid)), { passcode, at: nowISO() });
  batch.update(doc(db, PATHS.member(uid)), { role: 'leader' });
  await withTimeout(batch.commit());
}

export async function updateMyProfile(patch: { name?: string; avatar?: string | null }): Promise<void> {
  const { auth, db } = fb();
  const user = auth.currentUser;
  if (!user) return;
  await withTimeout(updateDoc(doc(db, PATHS.member(user.uid)), patch));
}

/** Nhóm trưởng xoá hoặc khôi phục thành viên */
export async function setMemberRemoved(memberId: string, removed: boolean): Promise<void> {
  const { auth, db } = fb();
  await updateDoc(
    doc(db, PATHS.member(memberId)),
    removed ? { removed: true, removedAt: nowISO(), removedBy: auth.currentUser?.uid ?? '' } : { removed: false, removedAt: null, removedBy: null },
  );
}
