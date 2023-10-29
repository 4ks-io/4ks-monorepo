import * as React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '4ks',
  description: '4ks',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayoutBody({ children }: RootLayoutProps) {
  // todo: handle auth

  return (
    <>
      <body>{children}</body>
    </>
  );
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <UserProvider>
        <RootLayoutBody>{children}</RootLayoutBody>
      </UserProvider>
    </html>
  );
}
