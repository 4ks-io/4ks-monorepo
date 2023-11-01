import { z } from 'zod';
import { publicProcedure, router } from '@/server/trpc';
import { getAPIClient, getSearchClient, handleAPIError } from '..';
import SearchRecipes from './searchRecipes';

export const recipesRouter = router({
  search: publicProcedure.input(z.string()).query(async (opts) => {
    const client = await getSearchClient();
    try {
      return await SearchRecipes(client, opts.input);
    } catch (e) {
      handleAPIError(e);
    }
  }),
  getAllByAuthor: publicProcedure.input(z.string()).query(async (opts) => {
    const api = await getAPIClient();
    try {
      return await api.recipes.getApiRecipesAuthor(opts.input);
    } catch (e) {
      handleAPIError(e);
    }
  }),
  getByID: publicProcedure.input(z.string()).query(async (opts) => {
    const api = await getAPIClient();
    try {
      return await api.recipes.getApiRecipes1(opts.input);
    } catch (e) {
      handleAPIError(e);
    }
  }),
});

export type RecipesRouter = typeof recipesRouter;
