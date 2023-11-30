import * as React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import AppHeader from '@/components/AppHeader';
import log from '@/libs/logger';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';

// user
export async function getUserData() {
  const session = await getSession();

  if (!session) return undefined;

  try {
    return (await serverClient.users.getAuthenticated()) ?? undefined;
  } catch (e) {
    if (e instanceof TRPCError && getHTTPStatusCodeFromError(e) === 404) {
      return undefined;
    }
    // todo: handle other errors?
  }
}

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export default async function DefaultLayout({ children }: DefaultLayoutProps) {
  // log().Debug(new Error(), [{ k: 'msg', v: 'DefaultLayout' }]);
  const user = await getUserData();

  return (
    <>
      <AppHeader user={user} />
      {children}
    </>
  );
}
