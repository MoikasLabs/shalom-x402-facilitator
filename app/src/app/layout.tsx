import { WalletProvider } from '@/components/WalletProvider';
import './globals.css';

export const metadata = {
  title: 'Shalom x402 - HTTP-Native Payments',
  description: 'Pay with Purpose. Every transaction honors God. 10% tithe hardcoded at the protocol level.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
