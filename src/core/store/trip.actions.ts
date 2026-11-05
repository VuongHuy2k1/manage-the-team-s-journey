import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import type { PayMethod } from '@/modules/completion/completion.type';
import type { ExpensePayMethod, Fund, FundRound, LedgerKind, MomoInfo } from '@/modules/fund/fund.type';
import { LEDGER_LIMIT, getRounds } from '@/modules/fund/utils/fund.utils';
import type { Change, VoteValue } from '@/modules/proposal/proposal.type';
import { diffSchedules } from '@/modules/proposal/utils/diff.utils';
import { applyChanges, currentVersionNumber } from '@/modules/proposal/utils/version.utils';
import type { Block, Estimate } from '@/modules/schedule/schedule.type';
import { getFirebase } from '../firebase/firebase.client';
import { PATHS } from '../firebase/firebase.paths';
import { createId, nowISO } from '../utils/id.utils';
import { tripStore, type TripState } from './trip.store';

const update = tripStore.mutate;

/** Cộng / trừ số dư quỹ và ghi một dòng vào lịch sử */
function moveFund(s: TripState, fund: Fund, delta: number, kind: LedgerKind, label: string): Fund {
  if (delta === 0) return fund;
  const at = nowISO();
  const balance = fund.balance + delta;
  return {
    ...fund,
    balance,
    balanceUpdatedAt: at,
    balanceUpdatedBy: s.currentMemberId,
    ledger: [
      { id: createId('tx'), at, by: s.currentMemberId, amount: delta, kind, label, balanceAfter: balance },
      ...(fund.ledger ?? []),
    ].slice(0, LEDGER_LIMIT),
  };
}

const blockTitle = (s: TripState, blockId: string) => s.schedule.find((b) => b.id === blockId)?.title ?? 'mốc lịch trình';
const memberLabel = (s: TripState, id: string) => s.members.find((m) => m.id === id)?.name ?? 'thành viên';
/** Kiểm tra trên giao diện; quyền thật do Firestore rules quyết định */
const isLeader = (s: TripState) => s.leaderIds.includes(s.currentMemberId);

/* ---------- Bản nháp (lưu riêng từng người) ---------- */

export async function saveDraft(memberId: string, blocks: Block[]) {
  const fb = getFirebase();
  if (!fb) return;
  const s = tripStore.getState();
  try {
    await setDoc(doc(fb.db, PATHS.draft(memberId)), {
      blocks,
      baseVersion: s.drafts[memberId]?.baseVersion ?? currentVersionNumber(s.versions),
      updatedAt: nowISO(),
    });
  } catch {
    tripStore.reportError('Không lưu được bản nháp, kiểm tra mạng.');
  }
}

export async function discardDraft(memberId: string) {
  const fb = getFirebase();
  if (fb) await deleteDoc(doc(fb.db, PATHS.draft(memberId))).catch(() => undefined);
}

export interface SubmitRequestInput {
  title: string;
  reason: string;
  changes: Change[];
  costDeltaPerPerson: number;
}

export async function submitRequest(memberId: string, input: SubmitRequestInput): Promise<string | null> {
  const draft = tripStore.getState().drafts[memberId];
  if (!draft || input.changes.length === 0) return null;
  const id = createId('req');
  const ok = await update((s) => ({
    ...s,
    requests: [
      {
        id,
        authorId: memberId,
        createdAt: nowISO(),
        title: input.title,
        reason: input.reason.trim(),
        baseVersion: draft.baseVersion,
        changes: input.changes,
        draft: draft.blocks,
        costDeltaPerPerson: input.costDeltaPerPerson,
        status: 'pending',
        votes: { [memberId]: 'up' },
      },
      ...s.requests,
    ],
  }));
  if (!ok) return null;
  await discardDraft(memberId);
  return id;
}

export function voteRequest(requestId: string, memberId: string, value: VoteValue) {
  return update((s) => ({
    ...s,
    requests: s.requests.map((r) =>
      r.id === requestId && r.status === 'pending' ? { ...r, votes: { ...r.votes, [memberId]: value } } : r,
    ),
  }));
}

export function approveRequest(requestId: string) {
  return update((s) => {
    const request = s.requests.find((r) => r.id === requestId);
    if (!isLeader(s) || !request || request.status !== 'pending') return s;
    const schedule = applyChanges(s.schedule, request.changes, request.draft);
    const at = nowISO();
    return {
      ...s,
      schedule,
      versions: [
        {
          number: currentVersionNumber(s.versions) + 1,
          type: 'approve',
          at,
          title: request.title,
          proposedBy: request.authorId,
          decidedBy: s.currentMemberId,
          requestId,
          changes: request.changes,
          schedule,
        },
        ...s.versions,
      ],
      requests: s.requests.map((r) =>
        r.id === requestId ? { ...r, status: 'approved', decidedBy: s.currentMemberId, decidedAt: at } : r,
      ),
    };
  });
}

export function rejectRequest(requestId: string, reason: string) {
  return update((s) => {
    if (!isLeader(s)) return s;
    return {
      ...s,
      requests: s.requests.map((r) =>
        r.id === requestId && r.status === 'pending'
          ? { ...r, status: 'rejected', decidedBy: s.currentMemberId, decidedAt: nowISO(), rejectReason: reason.trim() }
          : r,
      ),
    };
  });
}

export function restoreVersion(versionNumber: number) {
  return update((s) => {
    const target = s.versions.find((v) => v.number === versionNumber);
    if (!isLeader(s) || !target) return s;
    const changes = diffSchedules(s.schedule, target.schedule, s.members.length);
    if (changes.length === 0) return s;
    return {
      ...s,
      schedule: target.schedule,
      versions: [
        {
          number: currentVersionNumber(s.versions) + 1,
          type: 'restore',
          at: nowISO(),
          title: `Khôi phục về v${versionNumber}`,
          proposedBy: s.currentMemberId,
          decidedBy: s.currentMemberId,
          changes,
          schedule: target.schedule,
        },
        ...s.versions,
      ],
    };
  });
}

export interface BlockCostInput {
  title: string;
  estimate: Estimate | null;
  costLabel?: string;
}

/** Nhóm trưởng sửa nhanh tên / chi phí một mục (ghi vào lịch sử thay đổi) */
export function editBlockCost(blockId: string, input: BlockCostInput) {
  return update((s) => {
    const block = s.schedule.find((b) => b.id === blockId);
    if (!isLeader(s) || !block || !input.title.trim()) return s;
    const schedule = s.schedule.map((b) =>
      b.id === blockId ? { ...b, title: input.title.trim(), estimate: input.estimate, costLabel: input.costLabel?.trim() || undefined } : b,
    );
    const changes = diffSchedules(s.schedule, schedule, s.members.length);
    if (changes.length === 0) return s;
    return {
      ...s,
      schedule,
      versions: [
        {
          number: currentVersionNumber(s.versions) + 1,
          type: 'edit',
          at: nowISO(),
          title: `Sửa chi phí: ${input.title.trim()}`,
          proposedBy: s.currentMemberId,
          decidedBy: s.currentMemberId,
          changes,
          schedule,
        },
        ...s.versions,
      ],
    };
  });
}

/** Nhóm trưởng xoá một mục khỏi lịch trình (ghi vào lịch sử, khôi phục lại được) */
export function deleteBlock(blockId: string) {
  return update((s) => {
    const block = s.schedule.find((b) => b.id === blockId);
    if (!isLeader(s) || !block || s.completions[blockId]) return s;
    const schedule = s.schedule.filter((b) => b.id !== blockId);
    const changes = diffSchedules(s.schedule, schedule, s.members.length);
    const pendingCompletions = s.pendingCompletions.filter((p) => p.blockId !== blockId);
    return {
      ...s,
      schedule,
      pendingCompletions,
      versions: [
        {
          number: currentVersionNumber(s.versions) + 1,
          type: 'edit',
          at: nowISO(),
          title: `Xoá mục: ${block.title}`,
          proposedBy: s.currentMemberId,
          decidedBy: s.currentMemberId,
          changes,
          schedule,
        },
        ...s.versions,
      ],
    };
  });
}

/* ---------- Hoàn thành mốc ---------- */

export function requestCompletion(blockId: string, memberId: string) {
  return update((s) => {
    if (s.completions[blockId] || s.pendingCompletions.some((p) => p.blockId === blockId)) return s;
    return { ...s, pendingCompletions: [...s.pendingCompletions, { blockId, requestedBy: memberId, at: nowISO() }] };
  });
}

export interface ConfirmCompletionInput {
  actualTotal: number;
  payMethod: PayMethod;
  paidBy?: string;
}

export function confirmCompletion(blockId: string, input: ConfirmCompletionInput) {
  return update((s) => {
    if (!isLeader(s) || s.completions[blockId]) return s;
    const at = nowISO();
    const fromFund = input.payMethod === 'fund';
    return {
      ...s,
      completions: {
        ...s.completions,
        [blockId]: { blockId, ...input, confirmedBy: s.currentMemberId, at },
      },
      pendingCompletions: s.pendingCompletions.filter((p) => p.blockId !== blockId),
      fund: fromFund ? moveFund(s, s.fund, -input.actualTotal, 'completion', `Chi: ${blockTitle(s, blockId)}`) : s.fund,
    };
  });
}

export function undoCompletion(blockId: string) {
  return update((s) => {
    const done = s.completions[blockId];
    if (!isLeader(s) || !done) return s;
    const { [blockId]: _removed, ...rest } = s.completions;
    return {
      ...s,
      completions: rest,
      fund: done.payMethod === 'fund' ? moveFund(s, s.fund, done.actualTotal, 'completion-undo', `Hoàn tác chi: ${blockTitle(s, blockId)}`) : s.fund,
    };
  });
}

/* ---------- Quỹ ---------- */

/** Nhóm trưởng nhập lại số dư thật: phần chênh lệch được ghi vào lịch sử */
export function setFundBalance(amount: number, reason = '') {
  return update((s) =>
    isLeader(s) ? { ...s, fund: moveFund(s, s.fund, amount - s.fund.balance, 'adjust', reason.trim() || 'Điều chỉnh số dư') } : s,
  );
}

/* ---------- Khoản chi ngoài lịch trình ---------- */

export interface AddExpenseInput {
  title: string;
  /** Tổng cả nhóm */
  amount: number;
  payMethod: ExpensePayMethod;
  paidBy?: string;
  note?: string;
  /** Chi cho khoản dự tính nào */
  plannedId?: string;
}

export function addExpense(input: AddExpenseInput) {
  return update((s) => {
    if (!isLeader(s) || input.amount <= 0 || !input.title.trim()) return s;
    const expense = {
      id: createId('exp'),
      title: input.title.trim(),
      amount: input.amount,
      payMethod: input.payMethod,
      paidBy: input.payMethod === 'advance' ? input.paidBy : undefined,
      note: input.note?.trim() || undefined,
      at: nowISO(),
      by: s.currentMemberId,
      plannedId: input.plannedId || undefined,
    };
    const planned = (s.fund.planned ?? []).map((p) => (p.id === input.plannedId ? { ...p, expenseId: expense.id } : p));
    const fund = { ...s.fund, planned, expenses: [expense, ...(s.fund.expenses ?? [])] };
    return {
      ...s,
      fund: input.payMethod === 'fund' ? moveFund(s, fund, -input.amount, 'expense', `Chi ngoài lịch: ${expense.title}`) : fund,
    };
  });
}

export function deleteExpense(expenseId: string) {
  return update((s) => {
    if (!isLeader(s)) return s;
    const expense = (s.fund.expenses ?? []).find((e) => e.id === expenseId);
    if (!expense) return s;
    const planned = (s.fund.planned ?? []).map((p) => (p.expenseId === expenseId ? { ...p, expenseId: undefined } : p));
    const fund = { ...s.fund, planned, expenses: (s.fund.expenses ?? []).filter((e) => e.id !== expenseId) };
    return {
      ...s,
      fund: expense.payMethod === 'fund' ? moveFund(s, fund, expense.amount, 'expense-undo', `Xoá khoản chi: ${expense.title}`) : fund,
    };
  });
}

/* ---------- Chi phí dự tính ngoài lịch trình ---------- */

export interface PlannedCostInput {
  title: string;
  /** Dự tính cả nhóm */
  amount: number;
  note?: string;
}

export function addPlannedCost(input: PlannedCostInput) {
  return update((s) => {
    if (!isLeader(s) || input.amount < 0 || !input.title.trim()) return s;
    const item = {
      id: createId('plan'),
      title: input.title.trim(),
      amount: input.amount,
      note: input.note?.trim() || undefined,
      createdAt: nowISO(),
      by: s.currentMemberId,
    };
    return { ...s, fund: { ...s.fund, planned: [...(s.fund.planned ?? []), item] } };
  });
}

export function updatePlannedCost(id: string, input: PlannedCostInput) {
  return update((s) => {
    if (!isLeader(s) || input.amount < 0 || !input.title.trim()) return s;
    const planned = (s.fund.planned ?? []).map((p) =>
      p.id === id ? { ...p, title: input.title.trim(), amount: input.amount, note: input.note?.trim() || undefined } : p,
    );
    return { ...s, fund: { ...s.fund, planned } };
  });
}

/** Xoá khoản dự tính (khoản chi thật đã ghi, nếu có, vẫn giữ nguyên) */
export function deletePlannedCost(id: string) {
  return update((s) => {
    if (!isLeader(s)) return s;
    const expenses = (s.fund.expenses ?? []).map((e) => (e.plannedId === id ? { ...e, plannedId: undefined } : e));
    return { ...s, fund: { ...s.fund, expenses, planned: (s.fund.planned ?? []).filter((p) => p.id !== id) } };
  });
}

/* ---------- Các lần thu quỹ ---------- */

function roundsOf(s: TripState): FundRound[] {
  return getRounds(s.fund).map((r) => ({ ...r, payments: { ...r.payments } }));
}

export interface CreateRoundInput {
  title: string;
  amount: number;
  note?: string;
}

/** Nhóm trưởng tạo lần thu mới (ví dụ nộp bổ sung) */
export function createFundRound(input: CreateRoundInput) {
  return update((s) => {
    if (!isLeader(s) || input.amount <= 0) return s;
    const rounds = roundsOf(s);
    rounds.push({
      id: createId('round'),
      title: input.title.trim() || `Lần ${rounds.length + 1}`,
      amount: input.amount,
      note: input.note?.trim() || undefined,
      createdAt: nowISO(),
      createdBy: s.currentMemberId,
      payments: {},
    });
    return { ...s, fund: { ...s.fund, rounds } };
  });
}

/** Sửa tên / mức nộp của lần thu (chỉ đổi mức khi chưa ai nộp) */
export function updateFundRound(roundId: string, patch: Partial<CreateRoundInput>) {
  return update((s) => {
    if (!isLeader(s)) return s;
    const rounds = roundsOf(s);
    const round = rounds.find((r) => r.id === roundId);
    if (!round) return s;
    const anyPaid = Object.values(round.payments).some((p) => p.paid);
    if (patch.title !== undefined) round.title = patch.title.trim() || round.title;
    if (patch.note !== undefined) round.note = patch.note.trim() || undefined;
    if (patch.amount !== undefined && patch.amount > 0 && !anyPaid) round.amount = patch.amount;
    return { ...s, fund: { ...s.fund, rounds } };
  });
}

/** Xoá lần thu chưa ai nộp */
export function deleteFundRound(roundId: string) {
  return update((s) => {
    if (!isLeader(s)) return s;
    const rounds = roundsOf(s);
    const round = rounds.find((r) => r.id === roundId);
    if (!round || Object.values(round.payments).some((p) => p.paid) || rounds.length <= 1) return s;
    return { ...s, fund: { ...s.fund, rounds: rounds.filter((r) => r.id !== roundId) } };
  });
}

/** Đánh dấu một người đã / chưa nộp trong một lần thu: cộng / trừ vào số dư quỹ */
export function setRoundPaid(roundId: string, memberId: string, paid: boolean) {
  return update((s) => {
    if (!isLeader(s)) return s;
    const rounds = roundsOf(s);
    const round = rounds.find((r) => r.id === roundId);
    if (!round) return s;
    const prev = round.payments[memberId];
    if (Boolean(prev?.paid) === paid) return s;
    const amount = prev?.paid ? prev.amount : round.amount;
    const at = nowISO();
    round.payments[memberId] = { paid, amount, at, by: s.currentMemberId };
    const who = memberLabel(s, memberId);
    return {
      ...s,
      fund: moveFund(
        s,
        { ...s.fund, rounds },
        paid ? amount : -amount,
        paid ? 'round' : 'round-undo',
        paid ? `${who} nộp ${round.title}` : `Bỏ đánh dấu ${who} nộp ${round.title}`,
      ),
    };
  });
}

export function setMomo(info: Partial<MomoInfo>) {
  return update((s) => (isLeader(s) ? { ...s, fund: { ...s.fund, momo: { ...s.fund.momo, ...info } } } : s));
}

/* ---------- Dọn dữ liệu chạy thử trước khi dùng thật ---------- */

export interface ResetOptions {
  /** Lịch sử thay đổi lịch trình + các yêu cầu đổi lịch (giữ nguyên lịch hiện tại làm v1) */
  history: boolean;
  /** Lịch sử cộng / trừ quỹ */
  ledger: boolean;
  /** Đánh dấu hoàn thành, khoản chi ngoài lịch (giữ các khoản dự tính) */
  spending: boolean;
  /** Bỏ tick đã nộp ở mọi lần thu, đưa số dư quỹ về 0 */
  fund: boolean;
}

export function resetTripData(options: ResetOptions) {
  return update((s) => {
    if (!isLeader(s)) return s;
    const at = nowISO();
    let next: TripState = { ...s };
    if (options.history) {
      next = {
        ...next,
        requests: [],
        versions: [
          {
            number: 1,
            type: 'create',
            at,
            title: 'Lịch chính thức',
            proposedBy: s.currentMemberId,
            decidedBy: s.currentMemberId,
            changes: [],
            schedule: s.schedule,
          },
        ],
      };
    }
    let fund: Fund = { ...next.fund };
    if (options.ledger) fund = { ...fund, ledger: [] };
    if (options.spending) {
      next = { ...next, completions: {}, pendingCompletions: [] };
      fund = { ...fund, expenses: [], planned: (fund.planned ?? []).map((p) => ({ ...p, expenseId: undefined })) };
    }
    if (options.fund) {
      fund = {
        ...fund,
        balance: 0,
        balanceUpdatedAt: at,
        balanceUpdatedBy: s.currentMemberId,
        contributions: {},
        rounds: getRounds(fund).map((r) => ({ ...r, payments: {} })),
      };
    }
    return { ...next, fund };
  });
}
