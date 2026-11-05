/**
 * Khoá giao diện trong lúc đang gửi dữ liệu:
 * không đóng popup, không quay lại / chuyển trang cho tới khi xong.
 */
let count = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Mạng treo thì tự mở khoá sau chừng này, không để người dùng kẹt mãi */
const MAX_LOCK_MS = 20000;

/** Bắt đầu khoá, trả về hàm mở khoá (gọi nhiều lần cũng chỉ mở một lần) */
export function lockUi(maxMs = MAX_LOCK_MS): () => void {
  count += 1;
  emit();
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    clearTimeout(timer);
    count = Math.max(0, count - 1);
    emit();
  };
  const timer = setTimeout(release, maxMs);
  return release;
}

/** Khoá giao diện cho tới khi promise xong */
export function withUiLock<T>(task: Promise<T>): Promise<T> {
  const unlock = lockUi();
  return task.finally(unlock);
}

export function isUiLocked(): boolean {
  return count > 0;
}

export function subscribeUiLock(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
