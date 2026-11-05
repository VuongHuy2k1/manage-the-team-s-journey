export interface AvatarProps {
  name: string;
  color: string;
  /** Ảnh đại diện (URL hoặc data URL), không có thì hiện chữ cái đầu */
  src?: string | null;
  size?: number;
  /** Viền trắng khi xếp chồng */
  ring?: boolean;
  selected?: boolean;
}
