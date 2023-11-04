import * as React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { headers } from 'next/headers';
import { serverClient } from '@/trpc/serverClient';
import { notFound } from 'next/navigation';
import { RecipeContextProvider } from '@/providers/recipe-context';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { getRecipeData, getUserData, getRecipeMedia } from './data';
import { getRecipePageInfo } from '@/libs/navigation';
import log from '@/libs/logger';
import { RecipeHeader } from '@/components/Recipe/RecipeHeader';
import { RecipeControls } from '@/components/Recipe/RecipeControls';

export async function generateMetadata(): Promise<Metadata> {
  const page = getRecipePageInfo(headers());

  const [recipe, media] = await Promise.all([
    serverClient.recipes.getByID(page.recipeID),
    serverClient.recipes.getMediaByID(page.recipeID),
  ]);

  // todo: add recipe as jsondl

  const m = media?.data?.map((m) => {
    return m.variants?.map((v) => {
      return v.url;
    });
  });
  // console.log(m);
  // todo: add media to metatada

  return {
    title: recipe?.currentRevision?.name,
    description: '4ks',
    // openGraph: {
    //   images: m as string[],
    // },
  };
}

type RecipeLayoutProps = {
  children: React.ReactNode;
};

export default async function RecipeLayout({ children }: RecipeLayoutProps) {
  const page = getRecipePageInfo(headers());
  log().Debug(new Error(), 'layout: RecipeLayout ' + page.pathname);

  // first fetch recipe
  const recipe = await getRecipeData(page.recipeID);

  if (!recipe) {
    log().Error(new Error(), 'RecipeLayout: failed to fetch recipe');
    return notFound();
  }

  // data
  const [user, media] = await Promise.all([
    getUserData(),
    getRecipeMedia(page.recipeID),
  ]);

  return (
    <RecipeContextProvider
      isAuthenticated={!!user}
      recipe={recipe}
      media={media?.data || []}
    >
      {/* <Container style={{ paddingTop: 16, paddingBottom: 100 }}> */}
      <Container>
        <Stack>
          <RecipeHeader user={user} recipe={recipe} />
          <RecipeControls page={page} user={user} recipe={recipe} />
          {children}
        </Stack>
      </Container>
    </RecipeContextProvider>
  );
}
