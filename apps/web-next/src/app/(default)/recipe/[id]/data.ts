import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import { dtos_GetRecipeMediaResponse } from '@4ks/api-fetch';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';

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
      ({ data: [] } as dtos_GetRecipeMediaResponse)
    );
  } catch (e) {
    if (e instanceof TRPCError) {
      return { data: [] } as dtos_GetRecipeMediaResponse;
    }
  }
  // return {} as dtos_GetRecipeMediaResponse;
}
