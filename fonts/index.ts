import localFont from 'next/font/local';

export const spoqaHanSansNeo = localFont({
  src: [
    {
      path: './SpoqaHanSansNeo-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: './SpoqaHanSansNeo-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './SpoqaHanSansNeo-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './SpoqaHanSansNeo-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './SpoqaHanSansNeo-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-spoqa',
});

export const gmarketSans = localFont({
  src: [
    {
      path: './GmarketSansLight.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './GmarketSansMedium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './GmarketSansBold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-gmarket',
});
