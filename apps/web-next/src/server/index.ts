import { router } from '@/server/trpc';
import { usersRouter } from './users';
import { recipesRouter } from './recipes';
import { getSearchClient } from './search-client';
import { getAPIClient, apiURL } from './api-client';
import { handleAPIError, HttpStatusCode } from './error-handler';

export const appRouter = router({
  users: usersRouter,
  recipes: recipesRouter,
});

export type AppRouter = typeof appRouter;

export {
  getSearchClient,
  getAPIClient,
  apiURL,
  handleAPIError,
  HttpStatusCode,
};
