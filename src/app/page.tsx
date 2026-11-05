import { redirect } from 'next/navigation';
import { ROUTES } from '@/core/config/routes.config';

export default function Home() {
  redirect(ROUTES.schedule);
}
