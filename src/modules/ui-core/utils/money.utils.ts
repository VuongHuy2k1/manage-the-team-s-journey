const vnd = new Intl.NumberFormat('vi-VN');

/** 1238000 → "1.238.000đ" */
export function formatVND(value: number): string {
  return `${vnd.format(Math.round(value))}đ`;
}

/** 1238000 → "1.238k", 63000 → "63k" */
export function formatK(value: number): string {
  return `${vnd.format(Math.round(value / 1000))}k`;
}

/** Có dấu: +3k / −5k */
export function formatSignedK(value: number): string {
  if (value === 0) return '0k';
  const sign = value > 0 ? '+' : '−';
  return `${sign}${formatK(Math.abs(value))}`;
}

/** "1.238.000" hoặc "1238000" → 1238000 */
export function parseMoney(input: string): number {
  const digits = input.replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

/** Hiển thị số trong ô nhập: 1238000 → "1.238.000" */
export function formatMoneyInput(value: number): string {
  return value ? vnd.format(value) : '';
}

export function splitPerPerson(groupAmount: number, memberCount: number): number {
  if (memberCount <= 0) return groupAmount;
  return Math.round(groupAmount / memberCount);
}

export function percentDiff(actual: number, estimate: number): number | null {
  if (!estimate) return null;
  return Math.round(((actual - estimate) / estimate) * 1000) / 10;
}
