export interface ToastProps {
  open: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}
