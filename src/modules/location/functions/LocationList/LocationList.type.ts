import type { MemberLocation } from '../../hooks/useLocations.hook';

export interface LocationListProps {
  rows: MemberLocation[];
  onFocus: (memberId: string) => void;
}
