import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import { models_Recipe, models_RecipeMedia } from '@4ks/api-fetch';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import RecipeComponent from '@/components/Recipe';
import { RecipeContextProvider } from '@/providers/recipe-context';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

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
      ([] as models_RecipeMedia[])
    );
  } catch (e) {
    if (e instanceof TRPCError) {
      return [] as models_RecipeMedia[];
    }
  }
  return [] as models_RecipeMedia[];
}
