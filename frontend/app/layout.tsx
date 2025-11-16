import './globals.css';
import type { Metadata } from 'next';
import RecaptchaProvider from './components/RecaptchaProvider';

export const metadata: Metadata = {
  title: 'Job Portal',
  description: 'Job Portal Application',
  icons: {
    icon: '/favicon.ico.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RecaptchaProvider>
          {children}
        </RecaptchaProvider>
      </body>
    </html>
  );
}