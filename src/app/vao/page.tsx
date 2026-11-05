import { Suspense } from 'react';
import { EntryScreen } from '@/modules/account';

export default function Page() {
  return (
    <Suspense>
      <EntryScreen />
    </Suspense>
  );
}
