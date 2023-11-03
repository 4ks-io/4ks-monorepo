import * as React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import { notFound } from 'next/navigation';
import { RecipeContextProvider } from '@/providers/recipe-context';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import getRecipePageInfo, {
  getRecipeData,
  getUserData,
  getRecipeMedia,
} from '../data';
import { caller } from '@/libs/debug';

export async function generateMetadata(): Promise<Metadata> {
  const page = getRecipePageInfo();

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
  head: React.ReactNode;
  children: React.ReactNode;
};

export default async function RecipeLayout({
  head,
  children,
}: RecipeLayoutProps) {
  const page = getRecipePageInfo();

  // first fetch recipe
  const recipe = await getRecipeData(page.recipeID);

  if (!recipe) {
    console.log('caller', caller(new Error()));
    return notFound();
  }

  // data
  const [session, user, media] = await Promise.all([
    getSession(),
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
          {head}
          {children}
        </Stack>
      </Container>
    </RecipeContextProvider>
  );
}
