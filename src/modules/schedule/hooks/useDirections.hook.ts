'use client';

import { useCallback, useState } from 'react';
import type { Block } from '../schedule.type';
import { directionsUrl } from '../utils/maps.utils';

export function useDirections() {
  const [target, setTarget] = useState<Block | null>(null);
  const open = useCallback((block: Block) => setTarget(block), []);
  const close = useCallback(() => setTarget(null), []);
  return { target, open, close, url: target ? directionsUrl(target) : '' };
}
