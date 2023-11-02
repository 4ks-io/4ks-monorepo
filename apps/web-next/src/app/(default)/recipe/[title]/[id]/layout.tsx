import * as React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import Box from '@mui/material/Box';
import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import { models_Recipe } from '@4ks/api-fetch';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import RecipeComponent from '@/components/Recipe';
import { RecipeContextProvider } from '@/providers/recipe-context';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { getRecipeData, getUserData, getRecipeMedia } from './data';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pathname = headersList.get('x-url-pathname') || '';
  const recipeID = pathname.split('/').slice(-1)[0];

  const [recipe, media] = await Promise.all([
    serverClient.recipes.getByID(recipeID),
    serverClient.recipes.getMediaByID(recipeID),
  ]);

  // todo: add recipe as jsondl

  const m = media?.map((m) => {
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
  const headersList = headers();
  const pathname = headersList.get('x-url-pathname') || '';
  const recipeID = pathname.split('/').slice(-1)[0];

  // first fetch recipe
  const recipe = await getRecipeData(recipeID);

  if (!recipe) {
    return notFound();
  }

  // data
  const [session, user, media] = await Promise.all([
    getSession(),
    getUserData(),
    getRecipeMedia(recipeID),
  ]);

  console.log(head);

  return (
    <RecipeContextProvider
      isAuthenticated={!!user}
      recipe={recipe}
      media={media}
    >
      {/* <Container style={{ paddingTop: 16, paddingBottom: 100 }}> */}
      <Container>
        <Stack>
          {head}
          {!session && (
            <Container style={{ paddingTop: 16, paddingBottom: 16 }}>
              <Alert severity="warning">
                <AlertTitle>
                  <strong>Login</strong> to edit and save!
                </AlertTitle>
              </Alert>
            </Container>
          )}
          {children}
        </Stack>
      </Container>
    </RecipeContextProvider>
  );
}
