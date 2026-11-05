import type { LedgerEntry } from '../../fund.type';

export interface LedgerRowProps {
  entry: LedgerEntry;
  /** Tên người thao tác */
  byName: string;
  /** "Hôm nay · 14:20" */
  when: string;
}
