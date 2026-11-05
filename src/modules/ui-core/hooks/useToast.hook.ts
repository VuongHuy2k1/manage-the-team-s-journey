'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ToastState {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function useToast(duration = 4000) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const hide = useCallback(() => setToast(null), []);
  const show = useCallback(
    (next: ToastState) => {
      clearTimeout(timer.current);
      setToast(next);
      timer.current = setTimeout(hide, duration);
    },
    [duration, hide],
  );

  useEffect(() => () => clearTimeout(timer.current), []);
  return { toast, show, hide };
}
