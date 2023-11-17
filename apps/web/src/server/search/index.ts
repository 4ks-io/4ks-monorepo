import { z } from 'zod';
import { publicProcedure, router, logTrpc } from '@/server/trpc';
import { getSearchClient, handleAPIError } from '..';
import SearchRecipes from './searchRecipes';
import SearchAuthorRecipes from './searchAuthorRecipes';

export const searchRouter = router({
  recipes: publicProcedure.input(z.string()).query(async (opts) => {
    const client = await getSearchClient();
    const s = performance.now();

    try {
      return await SearchRecipes(client, opts.input);
    } catch (e) {
      handleAPIError(e);
    } finally {
      logTrpc(new Error(), opts.input, s, 'search.recipes');
    }
  }),
  recipesByAuthor: publicProcedure.input(z.string()).query(async (opts) => {
    const client = await getSearchClient();
    const s = performance.now();

    try {
      return await SearchAuthorRecipes(client, opts.input);
    } catch (e) {
      handleAPIError(e);
    } finally {
      logTrpc(new Error(), opts.input, s, 'search.recipesByAuthor');
    }
  }),
});

export type SearchRouter = typeof searchRouter;
