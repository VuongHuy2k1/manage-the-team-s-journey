'use client';

import { useLocationBeacon } from '../../hooks/useLocationBeacon.hook';

/** Chạy ngầm trên mọi màn: gửi vị trí khi người dùng đang bật chia sẻ */
export function LocationBeacon() {
  useLocationBeacon();
  return null;
}
