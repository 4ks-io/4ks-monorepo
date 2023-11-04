import { z } from 'zod';
import { publicProcedure, router } from '@/server/trpc';
import { getAPIClient, getSearchClient, handleAPIError } from '..';
import SearchRecipes from './searchRecipes';
import log from '@/libs/logger';

export const recipesRouter = router({
  search: publicProcedure.input(z.string()).query(async (opts) => {
    log().Debug(new Error(), 'trpc.recipes.search ' + opts.input);
    const client = await getSearchClient();
    try {
      return await SearchRecipes(client, opts.input);
    } catch (e) {
      handleAPIError(e);
    }
  }),
  getAllByAuthor: publicProcedure.input(z.string()).query(async (opts) => {
    log().Debug(new Error(), 'trpc.recipes.getAllByAuthor ' + opts.input);
    const api = await getAPIClient();
    try {
      return await api.recipes.getApiRecipesAuthor(opts.input);
    } catch (e) {
      handleAPIError(e);
    }
  }),
  // todo: only mutation?
  getByID: publicProcedure.input(z.string()).query(async (opts) => {
    log().Debug(new Error(), 'trpc.recipes.getByID ' + opts.input);
    const api = await getAPIClient();
    try {
      return await api.recipes.getApiRecipes1(opts.input);
    } catch (e) {
      handleAPIError(e);
    }
  }),
  getByIDMutation: publicProcedure.input(z.string()).mutation(async (opts) => {
    log().Debug(new Error(), 'trpc.recipes.getByIDMutation ' + opts.input);
    const api = await getAPIClient();
    try {
      const recipe = await api.recipes.getApiRecipes1(opts.input);
      return recipe;
    } catch (e) {
      handleAPIError(e);
    }
  }),
  getMediaByID: publicProcedure.input(z.string()).query(async (opts) => {
    log().Debug(new Error(), 'trpc.recipes.getMediaByID ' + opts.input);
    const api = await getAPIClient();
    try {
      return await api.recipes.getApiRecipesMedia(opts.input);
    } catch (e) {
      handleAPIError(e);
    }
  }),
  getMediaByIDMutation: publicProcedure
    .input(z.string())
    .mutation(async (opts) => {
      log().Debug(
        new Error(),
        'trpc.recipes.getMediaByIDMutation ' + opts.input
      );
      const api = await getAPIClient();
      try {
        return await api.recipes.getApiRecipesMedia(opts.input);
      } catch (e) {
        handleAPIError(e);
      }
    }),
  fork: publicProcedure.input(z.string()).mutation(async (opts) => {
    log().Debug(new Error(), 'trpc.recipes.fork ' + opts.input);
    const api = await getAPIClient();
    try {
      return await api.recipes.postApiRecipesFork(opts.input);
    } catch (e) {
      handleAPIError(e);
    }
  }),
});

export type RecipesRouter = typeof recipesRouter;
