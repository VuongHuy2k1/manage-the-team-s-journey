import type { MapPoint } from '../../location.type';

export interface GroupMapProps {
  points: MapPoint[];
  /** Id người cần đưa vào giữa bản đồ */
  focusId?: string | null;
}
