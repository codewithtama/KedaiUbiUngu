import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export const metadata: Metadata = {
  title: 'PurpleBite - Lezat dan Sehat dari Ubi Ungu',
  description: 'PurpleBite menyajikan aneka olahan ubi ungu premium yang lezat dan menyehatkan. Cocok untuk cemilan keluarga, acara spesial, dan hadiah manis.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
