'use client';

import { useSyncMeta } from '@/core/hooks/useTripState.hook';
import type { Member } from '../member.type';
import { useIsLeader } from './useIsLeader.hook';

const PLACEHOLDER: Member = { id: '', email: '', name: 'Bạn', color: '#A3AEC7', avatar: null, role: 'member', removed: false, joinedAt: '' };

export function useCurrentMember(): { member: Member; isLeader: boolean } {
  const { me } = useSyncMeta();
  return { member: me ?? PLACEHOLDER, isLeader: useIsLeader() };
}
