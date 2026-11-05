export interface RoundHeaderProps {
  title: string;
  amount: number;
  paidCount: number;
  total: number;
  collected: number;
  expected: number;
  note?: string;
  expanded: boolean;
  onToggle: () => void;
}
