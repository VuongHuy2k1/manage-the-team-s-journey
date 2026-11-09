'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Map as LeafletMap } from 'leaflet';
import { Button, Icon, Input } from '@/modules/ui-core';
import { usePlacePicker } from '../../hooks/usePlacePicker.hook';
import styles from './PlacePicker.module.scss';
import type { PlacePickerProps } from './PlacePicker.type';

/** Chọn địa chỉ trên bản đồ: ghim cố định giữa màn hình, kéo bản đồ cho ghim nằm đúng chỗ */
export function PlacePicker({ open, onClose, onPick, initial }: PlacePickerProps) {
  const p = usePlacePicker({ open, initial });
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const onMove = useRef(p.onMapMove);
  onMove.current = p.onMapMove;

  // Tạo bản đồ khi mở, huỷ khi đóng
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    import('leaflet').then((L) => {
      if (cancelled || !el.current) return;
      map.current = L.map(el.current, { zoomControl: false }).setView([p.center.lat, p.center.lng], 16);
      L.control.zoom({ position: 'bottomright' }).addTo(map.current);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map.current);
      map.current.on('moveend', () => {
        const c = map.current?.getCenter();
        if (c) onMove.current(c.lat, c.lng);
      });
      setTimeout(() => map.current?.invalidateSize(), 50);
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Bay tới vị trí khi chọn kết quả tìm kiếm / vị trí của tôi
  useEffect(() => {
    if (map.current && p.flyTick) map.current.setView([p.center.lat, p.center.lng], 17, { animate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.flyTick]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles.panel} role="dialog" aria-modal="true" aria-label="Chọn địa chỉ trên bản đồ">
      <header className={styles.head}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Đóng">
          <Icon name="back" size={22} />
        </button>
        <form
          className={styles.search}
          onSubmit={(e) => {
            e.preventDefault();
            void p.search();
          }}
        >
          <Input id="place-query" aria-label="Tìm địa điểm" placeholder="Tìm: chợ Đà Lạt, quán lẩu gà…" value={p.query} onChange={(e) => p.setQuery(e.target.value)} />
          <Button type="submit" variant="primary" disabled={p.searching}>{p.searching ? '…' : 'Tìm'}</Button>
        </form>
      </header>

      {p.results.length > 0 && (
        <ul className={styles.results}>
          {p.results.map((r) => (
            <li key={`${r.lat},${r.lng}`}>
              <button type="button" className={styles.result} onClick={() => p.choose(r)}>
                <Icon name="pin" size={18} className={styles.resultIcon} />
                <span className={styles.resultText}>
                  <b>{r.name}</b>
                  <span>{r.address}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.mapWrap}>
        <div ref={el} className={styles.map} />
        <span className={styles.pin} aria-hidden="true">
          <svg width="40" height="48" viewBox="0 0 40 48">
            <path d="M20 47s16-15.4 16-27A16 16 0 0 0 4 20c0 11.6 16 27 16 27z" fill="#25389A" stroke="#fff" strokeWidth="3" />
            <circle cx="20" cy="20" r="6" fill="#fff" />
          </svg>
        </span>
        <button type="button" className={styles.locate} onClick={p.locateMe} aria-label="Về vị trí của tôi">
          <Icon name="navigate" size={20} />
        </button>
      </div>

      <footer className={styles.foot}>
        {p.message && <p className={styles.message}>{p.message}</p>}
        <label className={styles.label} htmlFor="place-address">Địa chỉ tại ghim {p.resolving && <span className={styles.muted}>· đang lấy…</span>}</label>
        <Input id="place-address" value={p.address} onChange={(e) => p.setAddress(e.target.value)} placeholder="Kéo bản đồ để lấy địa chỉ" />
        <Button size="lg" variant="primary" block icon="check" onClick={() => { onPick(p.picked()); onClose(); }} disabled={p.resolving || !p.address.trim()}>
          Dùng vị trí này
        </Button>
      </footer>
    </div>,
    document.body,
  );
}
