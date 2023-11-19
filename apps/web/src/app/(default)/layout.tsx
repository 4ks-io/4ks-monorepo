import * as React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import AppHeader from '@/components/AppHeader';
import log from '@/libs/logger';

// user
export async function getUserData() {
  const session = await getSession();
  return (
    (session && (await serverClient.users.getAuthenticated())) ?? undefined
  );
}

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export default async function DefaultLayout({ children }: DefaultLayoutProps) {
  log().Debug(new Error(), [{ k: 'msg', v: 'DefaultLayout' }]);
  const user = await getUserData();

  return (
    <>
      <AppHeader user={user} />
      {children}
    </>
  );
}
