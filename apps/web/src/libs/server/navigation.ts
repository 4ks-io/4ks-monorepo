import { getSession, Session } from '@auth0/nextjs-auth0';
import { notFound, redirect } from 'next/navigation';
import { serverClient } from '@/trpc/serverClient';
import log from '@/libs/logger';
import { models_User } from '@4ks/api-fetch';
import { Page } from '../navigation';
import { authLoginPath } from '@/libs/navigation';

export type UserSession = {
  user: models_User | undefined;
  session: Session | undefined;
  isAuthenticated: boolean;
  isRegistered: boolean;
};

export async function handleUserNavigation(page: Page): Promise<UserSession> {
  const session = await getSession();
  log().Debug(new Error(), [
    { k: 'page', v: page },
    { k: 'session', v: !!session },
  ]);

  if (!session) {
    // unauthenticated
    if ([Page.REGISTER, Page.AUTHENTICATED].includes(page)) {
      redirect(authLoginPath);
    }

    // anonymous
    return {
      user: undefined,
      session: undefined,
      isAuthenticated: false,
      isRegistered: false,
    };
  }

  // check user exists
  const data = await serverClient.users.exists();

  // handle error / trpc should have crash before this
  if (!data?.Status || ![200, 204].includes(data?.Status)) {
    return notFound();
    // tr@ck: retry or return unexpected error page
  }

  // authenticatd but not registered
  if (data?.Status == 204) {
    if (page == Page.REGISTER) {
      return {
        user: undefined,
        session: session,
        isAuthenticated: true,
        isRegistered: false,
      };
    }
    redirect('/register');
  }

  // authenticated and registered
  if (data?.Status == 200 && page == Page.REGISTER) {
    redirect('/');
  }

  // authenticated and registered
  return {
    user: await serverClient.users.getAuthenticated(),
    session: session,
    isAuthenticated: true,
    isRegistered: true,
  };
}
