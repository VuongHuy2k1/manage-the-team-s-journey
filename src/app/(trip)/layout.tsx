import type { ReactNode } from 'react';
import { AuthGate } from '@/modules/account';

/** Các màn trong chuyến: phải đăng nhập và vào nhóm trước */
export default function TripLayout({ children }: { children: ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
