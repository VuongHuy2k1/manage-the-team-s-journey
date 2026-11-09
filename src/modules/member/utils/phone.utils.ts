/** Chỉ giữ chữ số và dấu + ở đầu (để gọi) */
export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  const plus = trimmed.startsWith('+') ? '+' : '';
  return plus + trimmed.replace(/\D/g, '');
}

/** Số hợp lệ: 9–15 chữ số (ví dụ 0912345678, +84912345678) */
export function isValidPhone(input: string): boolean {
  const digits = normalizePhone(input).replace('+', '');
  return digits.length >= 9 && digits.length <= 15;
}

/** Hiển thị dễ đọc: 0912 345 678 */
export function formatPhone(phone: string): string {
  const n = normalizePhone(phone);
  if (/^0\d{9}$/.test(n)) return `${n.slice(0, 4)} ${n.slice(4, 7)} ${n.slice(7)}`;
  if (/^\+84\d{9}$/.test(n)) return `+84 ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}`;
  return n;
}

export function telHref(phone: string): string {
  return `tel:${normalizePhone(phone)}`;
}
