/** Thông báo nhanh dạng toast, gọi được từ bất cứ đâu (không cần state riêng) */
export type NotifyTone = 'success' | 'info' | 'error';

export interface Notice {
  id: number;
  message: string;
  tone: NotifyTone;
}

let current: Notice | null = null;
let seq = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function notify(message: string, tone: NotifyTone = 'success', ms = 2600) {
  seq += 1;
  current = { id: seq, message, tone };
  emit();
  clearTimeout(timer);
  timer = setTimeout(() => {
    current = null;
    emit();
  }, ms);
}

export function dismissNotice() {
  clearTimeout(timer);
  current = null;
  emit();
}

export function getNotice(): Notice | null {
  return current;
}

export function subscribeNotice(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
