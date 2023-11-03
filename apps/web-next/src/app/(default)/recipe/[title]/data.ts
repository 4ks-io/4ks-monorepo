import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import { models_Recipe, dtos_GetRecipeMediaResponse } from '@4ks/api-fetch';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { headers } from 'next/headers';
import path from 'path';

// getData
export enum RecipeView {
  '' = 0, // content
  'versions' = 2,
  'forks' = 3,
  'media' = 5,
  'comments' = 6,
  // 'story' = 8,
  'settings' = 9,
}

export type RecipePageInfo = {
  pathname: string;
  title: string;
  recipeID: string;
  recipePage: number;
  recipePageID: string;
};

export default function getRecipePageInfo(): RecipePageInfo {
  const headersList = headers();
  const pathname = headersList.get('x-url-pathname') || '';
  const p = pathname.replace('/recipe/', '').split('/');
  // for (let i = 0; i < p.length; i++) {
  //   p[i] = decodeURIComponent(p[i]);
  //   console.log(p[i]);
  // }

  if (p.length == 2) {
    return {
      pathname: pathname,
      title: p[0],
      recipeID: p[1],
      recipePage: RecipeView[''],
      recipePageID: '',
    };
  }

  return {
    pathname: pathname,
    title: p[0],
    recipeID: p[1],
    recipePage: RecipeView[p[2] as keyof typeof RecipeView],
    recipePageID: p[2],
  };
}

// user
export async function getUserData() {
  const session = await getSession();
  return (
    (session && (await serverClient.users.getAuthenticated())) ?? undefined
  );
}

// recipe
export async function getRecipeData(id: string) {
  try {
    return (await serverClient.recipes.getByID(id)) ?? undefined;
  } catch (e) {
    if (e instanceof TRPCError && getHTTPStatusCodeFromError(e) === 404) {
      return undefined;
    }
    // todo: handle other errors?
  }
}

// recipe media
export async function getRecipeMedia(id: string) {
  try {
    return (
      (await serverClient.recipes.getMediaByID(id)) ??
      ({} as dtos_GetRecipeMediaResponse)
    );
  } catch (e) {
    if (e instanceof TRPCError) {
      return {} as dtos_GetRecipeMediaResponse;
    }
  }
  return {} as dtos_GetRecipeMediaResponse;
}
