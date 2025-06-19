import type { Metadata } from 'next';
import { gmarketSans, spoqaHanSansNeo } from '@/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'InsightBoard',
  description: '사용자 행동 분석 대시보드',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${spoqaHanSansNeo.className} ${gmarketSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
