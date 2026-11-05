import type { ReactNode } from 'react';

export type BadgeKind = 'moved' | 'edited' | 'added' | 'deleted' | 'ok' | 'no' | 'new' | 'warn' | 'draft';

export interface BadgeProps {
  kind: BadgeKind;
  children: ReactNode;
}
