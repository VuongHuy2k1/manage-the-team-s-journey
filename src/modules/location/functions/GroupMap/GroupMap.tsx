'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import { avatarInitial } from '@/modules/ui-core';
import styles from './GroupMap.module.scss';
import type { GroupMapProps } from './GroupMap.type';

/** Trung tâm Đà Lạt, dùng khi chưa ai chia sẻ vị trí */
const DALAT: [number, number] = [11.9404, 108.4583];

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

export function GroupMap({ points, focusId }: GroupMapProps) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const fitted = useRef(false);
  const leaflet = useRef<typeof import('leaflet') | null>(null);

  // Tạo bản đồ một lần (Leaflet chỉ chạy trên trình duyệt)
  useEffect(() => {
    let cancelled = false;
    import('leaflet').then((L) => {
      if (cancelled || !el.current || map.current) return;
      leaflet.current = L;
      map.current = L.map(el.current, { zoomControl: true, attributionControl: true }).setView(DALAT, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map.current);
      layer.current = L.layerGroup().addTo(map.current);
      draw();
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = () => {
    const L = leaflet.current;
    if (!L || !map.current || !layer.current) return;
    layer.current.clearLayers();
    points.forEach((p) => {
      const inner = p.avatar
        ? `<img src="${escapeHtml(p.avatar)}" alt="" referrerpolicy="no-referrer" />`
        : escapeHtml(avatarInitial(p.name));
      const icon = L.divIcon({
        className: '',
        html: `<div class="${styles.marker} ${p.isMe ? styles.me : ''} ${p.stale ? styles.stale : ''}" style="background:${escapeHtml(p.color)}">${inner}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      L.marker([p.lat, p.lng], { icon, title: p.name })
        .bindTooltip(escapeHtml(p.isMe ? `${p.name} (Bạn)` : p.name), { direction: 'top', offset: [0, -20] })
        .addTo(layer.current as LayerGroup);
    });
    if (!fitted.current && points.length > 0) {
      fitted.current = true;
      if (points.length === 1) map.current.setView([points[0].lat, points[0].lng], 15);
      else map.current.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number])), { padding: [40, 40], maxZoom: 16 });
    }
  };

  useEffect(draw, [points]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const p = points.find((x) => x.id === focusId);
    if (p && map.current) map.current.setView([p.lat, p.lng], 16, { animate: true });
  }, [focusId, points]);

  return (
    <div className={styles.wrap}>
      <div ref={el} className={styles.map} role="img" aria-label="Bản đồ vị trí các thành viên" />
      {points.length === 0 && <div className={styles.empty}>Chưa ai chia sẻ vị trí</div>}
    </div>
  );
}
