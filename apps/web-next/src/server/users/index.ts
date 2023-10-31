import { z } from 'zod';
import { publicProcedure, router } from '@/server/trpc';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { getAPIClient } from '..';
import { headAuthenticatedUser } from './headAuthenticatedUser';

export const usersRouter = router({
  get: publicProcedure.input(z.string()).query(async (opts) => {
    const api = await getAPIClient();
    return await api.users.getApiUsers1(opts.input);
  }),
  getAuthenticated: publicProcedure.query(async () => {
    const api = await getAPIClient();
    return await api.users.getApiUser();
  }),
  exists: publicProcedure.query(async () => {
    const { accessToken } = await getAccessToken();
    return await headAuthenticatedUser(`${accessToken}`);
  }),
  create: publicProcedure
    .input(
      z.object({
        username: z.string().trim(),
        displayName: z.string().trim(),
        email: z.string().email().trim(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const api = await getAPIClient();
      return await api.users.postApiUser(input);
    }),
  getUserName: publicProcedure
    .input(
      z.object({
        username: z.string().trim(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const api = await getAPIClient();
      return await api.users.postApiUsersUsername(input);
    }),
});

export type UsersRouter = typeof usersRouter;
