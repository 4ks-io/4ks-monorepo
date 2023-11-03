import * as React from 'react';
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
import { getRecipeData, getUserData, getRecipeMedia } from './data';
import RecipeEditingControls from '@/components/Recipe/RecipeContent/RecipeEditingControls';
import RecipeIngredients from '@/components/Recipe/RecipeContent/RecipeIngredients';
import RecipeInstructions from '@/components/Recipe/RecipeContent/RecipeInstructions';
import RecipeSocial from '@/components/Recipe/RecipeContent/RecipeSocial';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default async function RecipePage() {
  const headersList = headers();
  const pathname = headersList.get('x-url-pathname') || '';
  const recipeID = pathname.split('/').slice(-1)[0];

  // first fetch recipe
  const recipe = await getRecipeData(recipeID);

  if (!recipe) {
    return notFound();
  }

  // data
  const [user, media] = await Promise.all([
    getUserData(),
    getRecipeMedia(recipeID),
  ]);

  // return <RecipeComponent recipe={recipe} user={user} />;
  return (
    <>
      {!user?.id && (
        <Container style={{ paddingTop: 16, paddingBottom: 16 }}>
          <Alert severity="warning">
            <AlertTitle>
              <strong>Login</strong> to edit and save!
            </AlertTitle>
          </Alert>
        </Container>
      )}
      {/* todo: create */}
      <RecipeEditingControls user={user} create={false} />
      <RecipeIngredients />
      <div style={{ paddingBottom: 30 }} />
      <RecipeInstructions />
      <div style={{ paddingBottom: 30 }} />
      <RecipeSocial />
    </>
  );
}
