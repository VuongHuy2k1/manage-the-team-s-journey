export type AmountUnit = 'person' | 'group';

export interface AmountInputProps {
  id: string;
  value: number;
  unit: AmountUnit;
  onValueChange: (value: number) => void;
  onUnitChange: (unit: AmountUnit) => void;
  large?: boolean;
  placeholder?: string;
}
