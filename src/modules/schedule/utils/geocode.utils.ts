/**
 * Tìm địa điểm và đổi toạ độ ↔ địa chỉ bằng OpenStreetMap Nominatim (miễn phí).
 * Quy định dùng: tối đa 1 yêu cầu/giây, không tìm theo từng phím gõ.
 */
const BASE = 'https://nominatim.openstreetmap.org';
/** Khung ưu tiên quanh Đà Lạt: trái, trên, phải, dưới */
const DALAT_VIEWBOX = '108.30,12.08,108.60,11.84';

export const DALAT_CENTER = { lat: 11.9404, lng: 108.4583 };

export interface Place {
  lat: number;
  lng: number;
  /** Tên ngắn: "Chợ Đà Lạt" */
  name: string;
  /** Địa chỉ gọn để lưu vào khối */
  address: string;
}

interface NominatimItem {
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  address?: Record<string, string>;
}

function compactAddress(item: NominatimItem): string {
  const a = item.address ?? {};
  const street = [a.house_number, a.road].filter(Boolean).join(' ');
  const area = a.quarter || a.suburb || a.neighbourhood || a.village;
  const city = a.city || a.town || a.county || a.state;
  const parts = [street, area, city].filter(Boolean);
  if (parts.length >= 2) return Array.from(new Set(parts)).join(', ');
  return item.display_name.replace(/,\s*\d{5,6}/, '').replace(/,\s*Việt Nam$/, '');
}

function toPlace(item: NominatimItem): Place {
  const address = compactAddress(item);
  return {
    lat: Number(item.lat),
    lng: Number(item.lon),
    name: item.name || address.split(',')[0],
    address,
  };
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const url = `${BASE}/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=vn&accept-language=vi&viewbox=${DALAT_VIEWBOX}&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('search failed');
  return ((await res.json()) as NominatimItem[]).map(toPlace);
}

export async function reverseGeocode(lat: number, lng: number, signal?: AbortSignal): Promise<string> {
  const url = `${BASE}/reverse?format=jsonv2&addressdetails=1&zoom=18&accept-language=vi&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('reverse failed');
  const item = (await res.json()) as NominatimItem & { error?: string };
  if (item.error) return '';
  const place = toPlace(item);
  return item.name ? `${item.name}, ${place.address}` : place.address;
}
