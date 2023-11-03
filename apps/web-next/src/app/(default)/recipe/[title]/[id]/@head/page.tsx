import * as React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import { models_Recipe } from '@4ks/api-fetch';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { RecipeHeader } from '@/components/Recipe/RecipeHeader';
import { RecipeControls } from '@/components/Recipe/RecipeControls';
import getRecipePageInfo from '../../data';

export default async function RecipeHeaderPage() {
  const page = getRecipePageInfo();

  // user data
  const session = await getSession();
  const user =
    (session && (await serverClient.users.getAuthenticated())) ?? undefined;

  // recipe data
  const emptyRecipe = {} as models_Recipe;
  let recipe = emptyRecipe;
  try {
    recipe = (await serverClient.recipes.getByID(page.recipeID)) ?? {};
  } catch (e) {
    if (e instanceof TRPCError && getHTTPStatusCodeFromError(e) === 404) {
      return notFound();
    }
  }

  return (
    <>
      <RecipeHeader user={user} recipe={recipe} />
      <RecipeControls user={user} recipe={recipe} />
    </>
  );
}
