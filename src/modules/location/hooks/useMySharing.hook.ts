'use client';

import { useState } from 'react';
import { publishMyLocation, setSharing } from '@/core/api/location.api';
import { useTripState } from '@/core/hooks/useTripState.hook';
import type { ShareError } from '../location.type';
import { useLocationsList } from './useLocations.hook';

function toShareError(error: GeolocationPositionError): ShareError {
  if (error.code === error.PERMISSION_DENIED) return 'denied';
  if (error.code === error.TIMEOUT) return 'timeout';
  return 'unavailable';
}

export const SHARE_ERROR_TEXT: Record<Exclude<ShareError, null>, string> = {
  denied: 'Bạn đã chặn quyền vị trí. Vào cài đặt trình duyệt cho phép vị trí với trang này rồi thử lại.',
  unavailable: 'Không lấy được vị trí. Bật GPS / dịch vụ vị trí trên điện thoại rồi thử lại.',
  timeout: 'Lấy vị trí quá lâu. Ra chỗ thoáng hoặc bật GPS rồi thử lại.',
  insecure: 'Trình duyệt chỉ cho chia sẻ vị trí trên trang https. Mở bằng link https của web.',
  unsupported: 'Trình duyệt này không hỗ trợ lấy vị trí.',
};

/** Bật / tắt chia sẻ vị trí của mình */
export function useMySharing() {
  const { currentMemberId } = useTripState();
  const items = useLocationsList();
  const mine = items.find((l) => l.uid === currentMemberId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ShareError>(null);

  const start = () =>
    new Promise<void>((resolve) => {
      if (!('geolocation' in navigator)) {
        setError('unsupported');
        return resolve();
      }
      if (!window.isSecureContext) {
        setError('insecure');
        return resolve();
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await publishMyLocation(currentMemberId, { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
          resolve();
        },
        (err) => {
          setError(toShareError(err));
          resolve();
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
      );
    });

  return {
    sharing: Boolean(mine?.sharing),
    updatedAt: mine?.updatedAt,
    busy,
    error,
    errorText: error ? SHARE_ERROR_TEXT[error] : '',
    toggle: async () => {
      setBusy(true);
      setError(null);
      try {
        if (mine?.sharing) await setSharing(currentMemberId, false);
        else await start();
      } finally {
        setBusy(false);
      }
    },
  };
}
