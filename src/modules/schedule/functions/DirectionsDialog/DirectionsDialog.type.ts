import type { Block } from '../../schedule.type';

export interface DirectionsDialogProps {
  block: Block | null;
  url: string;
  onClose: () => void;
}
