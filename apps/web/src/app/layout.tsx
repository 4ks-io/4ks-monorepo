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
  const typesenseApikey =
    process.env.NEXT_PUBLIC_TYPESENSE_API_KEY || 'typesense-key';
  const typesenseUrl = process.env.NEXT_PUBLIC_TYPESENSE_URL || 'typesense-url';
  const typesensePath = process.env.NEXT_PUBLIC_TYPESENSE_PATH;

  return (
    <html lang="en" className={inter.className}>
      <ThemeRegistry>
        <TrpcProvider>
          <UserProvider>
            <SearchContextProvider
              typesenseApikey={typesenseApikey}
              typesenseUrl={typesenseUrl}
              typesensePath={typesensePath}
            >
              <body>{children}</body>
            </SearchContextProvider>
          </UserProvider>
        </TrpcProvider>
      </ThemeRegistry>
    </html>
  );
}
