'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY_PREFIX = 'dalat:guide:draft:';

function read(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function write(key: string, value: boolean) {
  try {
    if (value) window.localStorage.setItem(key, '1');
    else window.localStorage.removeItem(key);
  } catch {
    /* trình duyệt chặn lưu: lần sau vẫn hiện hướng dẫn */
  }
}

/**
 * Hướng dẫn lần đầu vào trang đề xuất đổi lịch.
 * "Không nhắc lại" được nhớ theo từng tài khoản trên trình duyệt này:
 * đăng nhập tài khoản khác thì hướng dẫn lại hiện.
 */
export function useDraftGuide(accountId: string) {
  const key = KEY_PREFIX + (accountId || 'guest');
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  /** Phát hoạt ảnh gợi ý trên thẻ sau khi đóng hướng dẫn */
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    const dismissed = read(key);
    setDontShow(dismissed);
    if (!dismissed) setOpen(true);
  }, [accountId, key]);

  useEffect(() => {
    if (!demo) return;
    const id = window.setTimeout(() => setDemo(false), 5400);
    return () => window.clearTimeout(id);
  }, [demo]);

  const close = useCallback(() => {
    write(key, dontShow);
    setOpen(false);
    setDemo(true);
  }, [key, dontShow]);

  return {
    open,
    demo,
    dontShow,
    setDontShow,
    show: () => setOpen(true),
    close,
  };
}
