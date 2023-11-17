import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import {
  dtos_GetRecipeMediaResponse,
  dtos_GetRecipeResponse,
} from '@4ks/api-fetch';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { initialRecipe } from '@/providers/recipe-context/recipe-context-init';

// // user
// export async function getUserData() {
//   const session = await getSession();
//   return (
//     (session && (await serverClient.users.getAuthenticated())) ?? undefined
//   );
// }

// recipe
export async function getRecipeData(
  id: string
): Promise<dtos_GetRecipeResponse | undefined> {
  if (id == '0') {
    return { data: initialRecipe } as dtos_GetRecipeResponse;
  }

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
