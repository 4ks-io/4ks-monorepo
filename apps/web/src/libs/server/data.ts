import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
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
