'use client';

import { useState } from 'react';
import { MAIN_NAV } from '@/core/config/nav.config';
import { useTripState } from '@/core/hooks/useTripState.hook';
import { AccountMenu } from '@/modules/member';
import { AppHeader, BottomNav, Button, useDisclosure } from '@/modules/ui-core';
import { BalanceCard } from '../../components/BalanceCard/BalanceCard';
import { MomoQrCard } from '../../components/MomoQrCard/MomoQrCard';
import { EditBalanceSheet } from '../../functions/EditBalanceSheet/EditBalanceSheet';
import { EditMomoSheet } from '../../functions/EditMomoSheet/EditMomoSheet';
import { ExpenseList } from '../../functions/ExpenseList/ExpenseList';
import { FundRounds } from '../../functions/FundRounds/FundRounds';
import { LedgerPreview } from '../../functions/LedgerPreview/LedgerPreview';
import { QrViewer } from '../../functions/QrViewer/QrViewer';
import { TripSummary } from '../../functions/TripSummary/TripSummary';
import { useFund } from '../../hooks/useFund.hook';
import { useTripSummary } from '../../hooks/useTripSummary.hook';
import { copyText } from '../../utils/fund.utils';
import styles from './FundScreen.module.scss';

export function FundScreen() {
  const f = useFund();
  const summary = useTripSummary();
  const { requests, members } = useTripState();
  const balanceSheet = useDisclosure();
  const momoSheet = useDisclosure();
  const qrViewer = useDisclosure();
  const [copied, setCopied] = useState(false);
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;

  const copyPhone = async () => {
    if (await copyText(f.fund.momo.phone)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <AppHeader title="Quỹ & chi phí" eyebrow={`${members.length} người`} aside={<AccountMenu />}>
        <BalanceCard
          balance={f.fund.balance}
          updatedText={f.updatedText}
          contributed={summary.contributed}
          spent={summary.spentActual}
          action={f.isLeader ? <Button size="sm" variant="accent" onClick={balanceSheet.open}>Sửa số dư</Button> : undefined}
        />
      </AppHeader>

      <main className={styles.main}>
        <MomoQrCard
          momo={f.fund.momo}
          target={f.latestRound?.amount ?? f.fund.target}
          targetLabel={f.latestRound?.title}
          fundLink={f.fundLink}
          onQrClick={qrViewer.open}
          actions={
            <>
              {f.fund.momo.phone && (
                <Button size="sm" icon={copied ? 'check' : 'copy'} onClick={copyPhone}>{copied ? 'Đã chép' : 'Chép SĐT'}</Button>
              )}
              {f.fund.momo.qrDataUrl && <Button size="sm" icon="arrow-down-right" onClick={qrViewer.open}>Tải QR</Button>}
              {f.isLeader && <Button size="sm" icon="edit" onClick={momoSheet.open}>{f.fund.momo.qrDataUrl ? 'Đổi QR' : 'Thêm QR'}</Button>}
            </>
          }
        />
        <FundRounds />
        <ExpenseList />
        <TripSummary />
        <LedgerPreview />
      </main>

      <BottomNav items={MAIN_NAV.map((i) => (i.key === 'requests' ? { ...i, badge: pendingRequests } : i))} activeKey="fund" />
      <EditBalanceSheet open={balanceSheet.isOpen} onClose={balanceSheet.close} />
      <EditMomoSheet open={momoSheet.isOpen} onClose={momoSheet.close} />
      <QrViewer open={qrViewer.isOpen} onClose={qrViewer.close} momo={f.fund.momo} target={f.latestRound?.amount ?? f.fund.target} />
    </>
  );
}
