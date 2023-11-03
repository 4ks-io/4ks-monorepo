import { headers } from 'next/headers';
import { serverClient } from '@/trpc/serverClient';
import { models_Recipe } from '@4ks/api-fetch';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { notFound } from 'next/navigation';
import { normalizeForURL } from '@/libs/navigation';
import { redirect } from 'next/navigation';
import getRecipePageInfo from './data';
import { caller } from '@/libs/debug';

export default async function RecipePage() {
  const page = getRecipePageInfo();

  // fetch
  let data = {} as models_Recipe;
  try {
    data = (await serverClient.recipes.getByID(page.recipeID)) ?? {};
  } catch (e) {
    if (e instanceof TRPCError && getHTTPStatusCodeFromError(e) === 404) {
      console.log(caller(new Error()));
      return notFound();
    }
  }

  const title = normalizeForURL(data.currentRevision?.name);

  redirect('/recipe/' + title + '/' + page.recipeID);
}
