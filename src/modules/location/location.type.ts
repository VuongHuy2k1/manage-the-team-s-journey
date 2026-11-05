export interface SharedLocation {
  uid: string;
  lat?: number;
  lng?: number;
  /** Sai số (mét) */
  accuracy?: number;
  sharing: boolean;
  updatedAt: string;
}

export interface MapPoint {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  lat: number;
  lng: number;
  isMe: boolean;
  stale: boolean;
}

export type ShareError = 'denied' | 'unavailable' | 'timeout' | 'insecure' | 'unsupported' | null;
