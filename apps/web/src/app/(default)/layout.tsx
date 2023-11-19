import * as React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import AppHeader from '@/components/AppHeader';

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export default async function DefaultLayout({ children }: DefaultLayoutProps) {
  console.log(process.env.NEXT_PUBLIC_AUTH0_PROFILE);
  const session = await getSession();
  const user =
    (session && (await serverClient.users.getAuthenticated())) ?? undefined;

  return (
    <>
      <AppHeader user={user} />
      {children}
    </>
  );
}
