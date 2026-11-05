import { formatVND, percentDiff } from '@/modules/ui-core/utils/money.utils';
import type { PayMethod } from '../completion.type';

export const PAY_METHOD_LABEL: Record<PayMethod, string> = {
  fund: 'Quỹ chung',
  advance: 'Có người ứng trước',
  self: 'Ai nấy trả',
};

export interface Variance {
  /** Thực tế − dự tính, null nếu mốc chưa có dự tính */
  diff: number | null;
  pct: number | null;
}

export function variance(estimate: number | null, actual: number): Variance {
  if (estimate === null) return { diff: null, pct: null };
  return { diff: actual - estimate, pct: percentDiff(actual, estimate) };
}

export function varianceText({ diff, pct }: Variance): string {
  if (diff === null) return 'Mốc này chưa có dự tính';
  if (diff === 0) return 'Khớp dự tính';
  const pctText = pct === null ? '' : ` (${diff > 0 ? '+' : '−'}${Math.abs(pct).toLocaleString('vi-VN')}%)`;
  return `${diff > 0 ? 'Vượt' : 'Dưới'} dự tính ${formatVND(Math.abs(diff))}${pctText}`;
}
