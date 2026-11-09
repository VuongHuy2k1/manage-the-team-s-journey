import { onAuthStateChanged, type User } from 'firebase/auth';
import { lockUi } from '@/modules/ui-core/utils/uiLock.utils';
import { collection, doc, onSnapshot, runTransaction, serverTimestamp, setDoc, type Unsubscribe } from 'firebase/firestore';
import type { Completion, PendingCompletion } from '@/modules/completion/completion.type';
import type { Fund } from '@/modules/fund/fund.type';
import type { Member } from '@/modules/member/member.type';
import type { Draft, ScheduleRequest, Version } from '@/modules/proposal/proposal.type';
import type { Block } from '@/modules/schedule/schedule.type';
import { createEmptyState, createSeedTripDoc } from '../data/seed.data';
import { getFirebase, isFirebaseConfigured } from '../firebase/firebase.client';
import { PATHS } from '../firebase/firebase.paths';

/** Tên và dòng mô tả chuyến (nhóm trưởng sửa được) */
export interface TripInfo {
  name: string;
  subtitle: string;
}

export interface TripState {
  schemaVersion: 1;
  /** Thành viên đang trong nhóm */
  members: Member[];
  /** Thành viên đã bị nhóm trưởng xoá */
  removedMembers: Member[];
  leaderIds: string[];
  /** uid người đang dùng trên thiết bị này */
  currentMemberId: string;
  /** Lịch chính thức (đã duyệt) */
  schedule: Block[];
  versions: Version[];
  /** Chỉ chứa bản nháp của chính mình */
  drafts: Record<string, Draft>;
  requests: ScheduleRequest[];
  completions: Record<string, Completion>;
  pendingCompletions: PendingCompletion[];
  fund: Fund;
  /** Chưa sửa lần nào thì dùng giá trị mặc định trong trip.config */
  info?: TripInfo;
}

/** Phần dữ liệu chung lưu ở document trips/{tripId} */
export type TripDoc = Pick<TripState, 'schemaVersion' | 'schedule' | 'versions' | 'requests' | 'completions' | 'pendingCompletions' | 'fund' | 'info'>;

const DOC_KEYS: (keyof TripDoc)[] = ['schemaVersion', 'schedule', 'versions', 'requests', 'completions', 'pendingCompletions', 'fund', 'info'];

export interface SyncMeta {
  configured: boolean;
  auth: 'loading' | 'signedOut' | 'signedIn';
  uid: string | null;
  /** none: đã đăng nhập nhưng chưa vào nhóm này */
  membership: 'unknown' | 'none' | 'member' | 'removed';
  me: Member | null;
  trip: 'idle' | 'loading' | 'ready' | 'missing' | 'error';
  membersReady: boolean;
  /** Có thay đổi trên máy này chưa gửi được lên server */
  pendingSync: boolean;
  /** Lỗi gần nhất khi ghi dữ liệu, hiển thị cho người dùng */
  error: string | null;
}

const INITIAL_META: SyncMeta = {
  configured: true,
  auth: 'loading',
  uid: null,
  membership: 'unknown',
  me: null,
  trip: 'idle',
  membersReady: false,
  pendingSync: false,
  error: null,
};

let state: TripState = createEmptyState();
let meta: SyncMeta = INITIAL_META;
const serverState = state;
const listeners = new Set<() => void>();
let started = false;
let memberUnsub: Unsubscribe | null = null;
let tripUnsubs: Unsubscribe[] = [];
let creatingTrip = false;
/** Số thay đổi đang gửi; trong lúc đó giữ giao diện theo bản trên máy để không nháy về số cũ */
let pendingMutations = 0;
let latestServerDoc: TripDoc | null = null;

const emit = () => listeners.forEach((l) => l());
const patchState = (patch: Partial<TripState>) => {
  state = { ...state, ...patch };
  emit();
};
const patchMeta = (patch: Partial<SyncMeta>) => {
  meta = { ...meta, ...patch };
  emit();
};

function toMember(id: string, data: Record<string, unknown>): Member {
  return {
    id,
    email: String(data.email ?? ''),
    name: String(data.name ?? 'Thành viên'),
    color: String(data.color ?? '#A3AEC7'),
    avatar: (data.avatar as string | null) ?? null,
    phone: typeof data.phone === 'string' && data.phone ? data.phone : undefined,
    role: data.role === 'leader' ? 'leader' : 'member',
    removed: Boolean(data.removed),
    joinedAt: String(data.joinedAt ?? ''),
    removedAt: data.removedAt as string | undefined,
    removedBy: data.removedBy as string | undefined,
  };
}

function pickDoc(s: TripState): TripDoc {
  return Object.fromEntries(DOC_KEYS.map((k) => [k, s[k]])) as TripDoc;
}

function stopTrip() {
  tripUnsubs.forEach((u) => u());
  tripUnsubs = [];
}

function friendlyError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  if (code.includes('permission-denied')) return 'Bạn không có quyền làm việc này.';
  if (code.includes('unavailable') || code.includes('failed-precondition')) return 'Mất kết nối mạng, thử lại khi có mạng.';
  return 'Không lưu được thay đổi, thử lại sau.';
}

async function createTripIfMissing(uid: string) {
  const fb = getFirebase();
  if (!fb || creatingTrip) return;
  creatingTrip = true;
  try {
    await setDoc(doc(fb.db, PATHS.trip()), { ...createSeedTripDoc(uid, new Date().toISOString()), updatedAt: serverTimestamp() });
  } catch (e) {
    patchMeta({ error: friendlyError(e) });
  } finally {
    creatingTrip = false;
  }
}

function startTrip(uid: string) {
  const fb = getFirebase();
  if (!fb || tripUnsubs.length) return;
  patchMeta({ trip: 'loading', membersReady: false });

  tripUnsubs.push(
    onSnapshot(
      collection(fb.db, PATHS.members()),
      (snap) => {
        const all = snap.docs.map((d) => toMember(d.id, d.data())).sort((a, b) => a.joinedAt.localeCompare(b.joinedAt));
        const active = all.filter((m) => !m.removed);
        patchState({
          members: active,
          removedMembers: all.filter((m) => m.removed),
          leaderIds: active.filter((m) => m.role === 'leader').map((m) => m.id),
        });
        patchMeta({ membersReady: true });
      },
      (e) => { console.error('[members]', e); patchMeta({ trip: 'error' }); },
    ),
  );

  tripUnsubs.push(
    onSnapshot(
      doc(fb.db, PATHS.trip()),
      { includeMetadataChanges: true },
      (snap) => {
        if (snap.metadata.hasPendingWrites !== meta.pendingSync) patchMeta({ pendingSync: snap.metadata.hasPendingWrites });
        if (!snap.exists()) {
          patchMeta({ trip: 'missing' });
          if (meta.me?.role === 'leader') void createTripIfMissing(uid);
          return;
        }
        const serverDoc = snap.data() as TripDoc;
        if (pendingMutations > 0) latestServerDoc = serverDoc;
        else patchState(pickDoc({ ...state, ...serverDoc }));
        if (meta.trip !== 'ready') patchMeta({ trip: 'ready' });
      },
      (e) => { console.error('[trip]', e); patchMeta({ trip: 'error' }); },
    ),
  );

  tripUnsubs.push(
    onSnapshot(
      doc(fb.db, PATHS.draft(uid)),
      (snap) => patchState({ drafts: snap.exists() ? { [uid]: snap.data() as Draft } : {} }),
      (e) => console.warn('[draft]', e),
    ),
  );
}

function handleUser(user: User | null) {
  const fb = getFirebase();
  memberUnsub?.();
  memberUnsub = null;
  stopTrip();
  if (!fb || !user) {
    state = createEmptyState();
    patchMeta({ ...INITIAL_META, auth: 'signedOut' });
    return;
  }
  state = { ...createEmptyState(), currentMemberId: user.uid };
  patchMeta({ ...INITIAL_META, auth: 'signedIn', uid: user.uid });

  memberUnsub = onSnapshot(
    doc(fb.db, PATHS.member(user.uid)),
    { includeMetadataChanges: true },
    (snap) => {
      if (snap.metadata.hasPendingWrites !== meta.pendingSync) patchMeta({ pendingSync: snap.metadata.hasPendingWrites });
      if (!snap.exists()) {
        stopTrip();
        patchMeta({ membership: 'none', me: null });
        return;
      }
      const me = toMember(snap.id, snap.data());
      if (me.removed) {
        stopTrip();
        patchMeta({ membership: 'removed', me });
        return;
      }
      patchMeta({ membership: 'member', me });
      startTrip(user.uid);
      if (meta.trip === 'missing' && me.role === 'leader') void createTripIfMissing(user.uid);
    },
    (e) => {
      console.error('[member]', e);
      patchMeta({ membership: 'none' });
    },
  );
}

/**
 * Kho dữ liệu đồng bộ với Firebase: lắng nghe tài khoản, thành viên, chuyến đi, bản nháp của mình.
 * Ghi dữ liệu chung bằng transaction để nhiều người sửa cùng lúc không đè nhau.
 */
export const tripStore = {
  getState: (): TripState => state,
  getServerState: (): TripState => serverState,
  getMeta: (): SyncMeta => meta,
  getServerMeta: (): SyncMeta => INITIAL_META,

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  start(): void {
    if (started || typeof window === 'undefined') return;
    started = true;
    if (!isFirebaseConfigured()) {
      patchMeta({ configured: false, auth: 'signedOut' });
      return;
    }
    const fb = getFirebase();
    if (fb) onAuthStateChanged(fb.auth, handleUser);
  },

  /**
   * Áp một thay đổi lên dữ liệu chung.
   * 1. Cập nhật ngay trên máy (giao diện đổi tức thì).
   * 2. Gửi lên server bằng transaction: đọc bản mới nhất rồi áp lại thay đổi, nên nhiều người sửa cùng lúc không đè nhau.
   * 3. Server từ chối thì trả lại như cũ và báo lỗi.
   */
  async mutate(updater: (prev: TripState) => TripState): Promise<boolean> {
    const fb = getFirebase();
    if (!fb) return false;
    const before = pickDoc(state);
    const optimistic = updater(state);
    if (optimistic === state) return true;
    pendingMutations += 1;
    const unlockUi = lockUi();
    patchState(pickDoc(optimistic));
    try {
      await runTransaction(fb.db, async (tx) => {
        const ref = doc(fb.db, PATHS.trip());
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error('Chuyến đi chưa được tạo');
        const current: TripState = { ...state, ...pickDoc({ ...state, ...(snap.data() as TripDoc) }) };
        const next = updater(current);
        if (next === current) return;
        tx.set(ref, { ...pickDoc(next), updatedAt: serverTimestamp() });
      });
      return true;
    } catch (e) {
      console.error(e);
      patchState(before);
      patchMeta({ error: friendlyError(e) });
      return false;
    } finally {
      unlockUi();
      pendingMutations -= 1;
      if (pendingMutations === 0 && latestServerDoc) {
        patchState(pickDoc({ ...state, ...latestServerDoc }));
        latestServerDoc = null;
      }
    }
  },

  /** Nhóm trưởng tạo lịch trình ban đầu khi chuyến đi chưa có */
  async createTrip(): Promise<void> {
    if (meta.uid && meta.me?.role === 'leader') await createTripIfMissing(meta.uid);
  },

  reportError(message: string): void {
    patchMeta({ error: message });
  },

  clearError(): void {
    patchMeta({ error: null });
  },
};
