import { NavigationBar } from '@/components/Navigation';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Winston Tools',
  description: 'Useful Tools'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <main className='flex min-h-screen flex-col text-primary-black dark:text-primary-white'>
          <NavigationBar />
          {children}
        </main>
      </body>
    </html>
  );
}
