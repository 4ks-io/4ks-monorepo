import { router } from '@/server/trpc';
import { recipesRouter } from './recipes';
import { searchRouter } from './search';
import { usersRouter } from './users';
import { getSearchClient } from './search-client';
import { getAPIClient, apiURL } from './api-client';
import { handleAPIError, HttpStatusCode } from './error-handler';

export const appRouter = router({
  recipes: recipesRouter,
  search: searchRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;

export {
  getSearchClient,
  getAPIClient,
  apiURL,
  handleAPIError,
  HttpStatusCode,
};
