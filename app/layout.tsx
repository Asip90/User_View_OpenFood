import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import dynamic from 'next/dynamic';
import Cart from '@/components/CartPanel'
// const Cart = dynamic(() => import('@/components/Cart'), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QT Food - Commander en ligne',
  description: 'Commandez vos plats préférés directement à votre table',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-50`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}