'use client';

import { useIsLeader } from '../../hooks/useIsLeader.hook';
import type { LeaderOnlyProps } from './LeaderOnly.type';

export function LeaderOnly({ children, fallback = null }: LeaderOnlyProps) {
  return <>{useIsLeader() ? children : fallback}</>;
}
