import type { PickedPlace } from '../../hooks/usePlacePicker.hook';

export interface PlacePickerProps {
  open: boolean;
  onClose: () => void;
  onPick: (place: PickedPlace) => void;
  /** Vị trí / chữ có sẵn để mở bản đồ đúng chỗ */
  initial?: { lat?: number; lng?: number; address?: string; query?: string };
}
