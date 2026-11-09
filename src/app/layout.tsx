import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@/modules/ui-core/styles/globals.scss';
import styles from './layout.module.scss';

export const metadata: Metadata = {
  title: 'Đà Lạt 3N2Đ · Sổ tay hành trình',
  description: 'Lịch trình, đề xuất đổi lịch, quỹ và chi phí chuyến Đà Lạt của nhóm.',
  authors: [{ name: 'Nhân Nguyễn' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#25389A',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap"
        />
      </head>
      <body>
        <div className={styles.app}>{children}</div>
      </body>
    </html>
  );
}
