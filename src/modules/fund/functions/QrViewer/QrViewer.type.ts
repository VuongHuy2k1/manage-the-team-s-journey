import type { MomoInfo } from '../../fund.type';

export interface QrViewerProps {
  open: boolean;
  onClose: () => void;
  momo: MomoInfo;
  target: number;
}
