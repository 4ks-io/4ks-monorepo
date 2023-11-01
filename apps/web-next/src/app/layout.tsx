import * as React from 'react';
import type { Metadata } from 'next';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import TrpcProvider from '@/trpc/Provider';
import { serverClient } from '@/trpc/serverClient';
import { getSession } from '@auth0/nextjs-auth0';

export const metadata: Metadata = {
  title: '4ks',
  description: '4ks',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

async function RootLayoutBody({ children }: RootLayoutProps) {
  const session = await getSession();
  const pathname = headers().get('x-url-pathname');

  if (session) {
    // check user exists
    const data = await serverClient.users.exists();

    if (data.Status == 204) {
      if (pathname != '/register') {
        redirect('/register');
      }
    } else if (pathname == '/register') {
      redirect('/');
    }
  }

  return <body>{children}</body>;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <ThemeRegistry>
        <TrpcProvider>
          <UserProvider>
            {/* @ts-expect-error Server Component */}
            <RootLayoutBody>{children}</RootLayoutBody>
          </UserProvider>
        </TrpcProvider>
      </ThemeRegistry>
    </html>
  );
}
