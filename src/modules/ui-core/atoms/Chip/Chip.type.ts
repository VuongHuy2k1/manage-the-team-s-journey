import type { ReactNode } from 'react';

export type ChipTone = 'food' | 'place' | 'move' | 'rest' | 'neutral';

export interface ChipProps {
  tone?: ChipTone;
  children: ReactNode;
}
