export interface DayTabOption {
  value: number;
  label: string;
  /** Chấm cam báo có thay đổi */
  dot?: boolean;
}

export interface DayTabsProps {
  options: DayTabOption[];
  value: number;
  onChange: (value: number) => void;
  /** onBrand: trên nền xanh · onLight: trên nền trắng */
  tone?: 'onBrand' | 'onLight';
}
