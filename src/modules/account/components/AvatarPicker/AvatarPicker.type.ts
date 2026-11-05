export interface AvatarPickerProps {
  id: string;
  name: string;
  color: string;
  src: string | null;
  onPick: (file: File) => void;
  onRemove?: () => void;
  disabled?: boolean;
}
