/** "Hôm nay · 09:12", "Hôm qua · 20:05", "03/11 · 16:52" */
export function formatWhen(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  const hm = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(d)) / 86400000);
  if (days === 0) return `Hôm nay · ${hm}`;
  if (days === 1) return `Hôm qua · ${hm}`;
  return `${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} · ${hm}`;
}

export function timeAgo(iso: string, now: Date = new Date()): string {
  const minutes = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return 'vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.round(hours / 24)} ngày trước`;
}
