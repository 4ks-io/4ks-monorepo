import * as React from 'react';
import type { Metadata } from 'next';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import TrpcProvider from '@/trpc/Provider';
import { Inter } from 'next/font/google';
import { SearchContextProvider } from '@/providers/search-context';

export const metadata: Metadata = {
  title: '4ks',
  description: '4ks',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.className}>
      <ThemeRegistry>
        <TrpcProvider>
          <UserProvider>
            <SearchContextProvider>
              <body>{children}</body>
            </SearchContextProvider>
          </UserProvider>
        </TrpcProvider>
      </ThemeRegistry>
    </html>
  );
}
