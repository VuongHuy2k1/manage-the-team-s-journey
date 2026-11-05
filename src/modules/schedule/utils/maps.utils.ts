import type { Block } from '../schedule.type';

/** Địa chỉ còn là chỗ trống kiểu "[Địa chỉ quán]" */
export function isPlaceholderAddress(address: string): boolean {
  return !address.trim() || /^\[.*\]$/.test(address.trim());
}

export function hasPin(block: Pick<Block, 'lat' | 'lng'>): boolean {
  return typeof block.lat === 'number' && typeof block.lng === 'number';
}

function query(block: Block): string {
  if (hasPin(block)) return `${block.lat},${block.lng}`;
  if (block.mapQuery) return block.mapQuery;
  if (!isPlaceholderAddress(block.address)) return block.address;
  return `${block.title}, Đà Lạt`;
}

/** Mở Google Maps chỉ đường từ vị trí hiện tại tới mốc */
export function directionsUrl(block: Block): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query(block))}`;
}

export function searchUrl(block: Block): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query(block))}`;
}
