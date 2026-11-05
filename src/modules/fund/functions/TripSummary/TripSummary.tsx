'use client';

import { ROUTES } from '@/core/config/routes.config';
import { PerPersonGrid } from '../../components/PerPersonGrid/PerPersonGrid';
import { TripSummaryCard } from '../../components/TripSummaryCard/TripSummaryCard';
import { useTripSummary } from '../../hooks/useTripSummary.hook';
import styles from './TripSummary.module.scss';

export function TripSummary() {
  const summary = useTripSummary();
  return (
    <div className={styles.wrap}>
      <TripSummaryCard summary={summary} estimateHref={ROUTES.estimate} actualHref={ROUTES.actual} />
      <PerPersonGrid perPerson={summary.perPerson} />
    </div>
  );
}
