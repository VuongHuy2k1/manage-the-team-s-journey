'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DALAT_CENTER, reverseGeocode, searchPlaces, type Place } from '../utils/geocode.utils';

export interface PickedPlace {
  lat: number;
  lng: number;
  address: string;
}

interface Options {
  open: boolean;
  initial?: { lat?: number; lng?: number; address?: string; query?: string };
}

/** Chọn vị trí: kéo bản đồ để ghim nằm đúng chỗ, hoặc tìm theo tên */
export function usePlacePicker({ open, initial }: Options) {
  const [center, setCenter] = useState(DALAT_CENTER);
  /** Tăng lên mỗi khi cần bản đồ bay tới center (chọn kết quả, vị trí của tôi) */
  const [flyTick, setFlyTick] = useState(0);
  const [address, setAddress] = useState('');
  const [resolving, setResolving] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState('');
  const reverseTimer = useRef<ReturnType<typeof setTimeout>>();
  const reverseAbort = useRef<AbortController>();
  const skipNextReverse = useRef(false);

  useEffect(() => {
    if (!open) return;
    const hasPin = typeof initial?.lat === 'number' && typeof initial?.lng === 'number';
    setCenter(hasPin ? { lat: initial?.lat as number, lng: initial?.lng as number } : DALAT_CENTER);
    setFlyTick((t) => t + 1);
    setAddress(hasPin ? initial?.address ?? '' : '');
    setQuery(initial?.query ?? '');
    setResults([]);
    setMessage(hasPin ? '' : 'Kéo bản đồ để ghim đúng chỗ, hoặc tìm theo tên.');
    skipNextReverse.current = hasPin;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => {
    clearTimeout(reverseTimer.current);
    reverseAbort.current?.abort();
  }, []);

  /** Bản đồ dừng di chuyển: lấy địa chỉ tại ghim (chờ 0,8s để không gọi dồn dập) */
  const onMapMove = useCallback((lat: number, lng: number) => {
    setCenter({ lat, lng });
    if (skipNextReverse.current) {
      skipNextReverse.current = false;
      return;
    }
    clearTimeout(reverseTimer.current);
    reverseAbort.current?.abort();
    setResolving(true);
    reverseTimer.current = setTimeout(async () => {
      const ctrl = new AbortController();
      reverseAbort.current = ctrl;
      try {
        const text = await reverseGeocode(lat, lng, ctrl.signal);
        setAddress(text || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        setMessage('');
      } catch {
        if (!ctrl.signal.aborted) setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      } finally {
        if (!ctrl.signal.aborted) setResolving(false);
      }
    }, 800);
  }, []);

  const search = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setMessage('');
    try {
      const found = await searchPlaces(q.toLowerCase().includes('đà lạt') ? q : `${q}, Đà Lạt`);
      setResults(found);
      if (found.length === 0) setMessage('Không tìm thấy. Thử tên khác hoặc kéo bản đồ để ghim.');
    } catch {
      setMessage('Không tìm được lúc này, kiểm tra mạng rồi thử lại.');
    } finally {
      setSearching(false);
    }
  };

  const choose = (place: Place) => {
    skipNextReverse.current = true;
    setCenter({ lat: place.lat, lng: place.lng });
    setAddress(place.address.startsWith(place.name) ? place.address : `${place.name}, ${place.address}`);
    setResults([]);
    setFlyTick((t) => t + 1);
  };

  const locateMe = () => {
    if (!('geolocation' in navigator)) return setMessage('Trình duyệt không hỗ trợ lấy vị trí.');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setFlyTick((t) => t + 1);
      },
      () => setMessage('Không lấy được vị trí của bạn. Kiểm tra quyền vị trí / GPS.'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return {
    center,
    flyTick,
    address,
    setAddress,
    resolving,
    query,
    setQuery,
    results,
    searching,
    message,
    onMapMove,
    search,
    choose,
    locateMe,
    picked: (): PickedPlace => ({ lat: center.lat, lng: center.lng, address: address.trim() }),
  };
}
