import { getAccessToken } from '@auth0/nextjs-auth0';
import { router } from '@/server/trpc';
import { ApiClient } from '@4ks/api-fetch';
import { usersRouter } from './users';

export const apiURL = `${process.env.IO_4KS_API_URL}`;

export async function getAPIClient(): Promise<ApiClient> {
  const { accessToken } = await getAccessToken();
  return new ApiClient({
    BASE: apiURL,
    TOKEN: accessToken,
  });
}

export const appRouter = router({
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
