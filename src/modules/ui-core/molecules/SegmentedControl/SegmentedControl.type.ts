export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  /** pills: các nút tròn rời · track: thanh nền xám liền */
  variant?: 'pills' | 'track';
  wrap?: boolean;
}
