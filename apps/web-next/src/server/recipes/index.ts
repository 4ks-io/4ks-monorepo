import { z } from 'zod';
import { publicProcedure, router } from '@/server/trpc';
import { getAPIClient, handleAPIError } from '..';

export const recipesRouter = router({
  getAllByAuthor: publicProcedure.input(z.string()).query(async (opts) => {
    const api = await getAPIClient();
    try {
      return await api.recipes.getApiRecipesAuthor(opts.input);
    } catch (e) {
      handleAPIError(e);
    }
  }),
});

export type RecipesRouter = typeof recipesRouter;
