import * as React from 'react';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Container from '@mui/material/Container';
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

  // data
  const [user, recipe] = await Promise.all([
    getUserData(),
    getRecipeData(recipeID),
  ]);

  if (!recipe) {
    return notFound();
  }

  return (
    <>
      {!user?.id && (
        <Alert severity="warning">
          <AlertTitle>
            <strong>Login</strong> to edit and save!
          </AlertTitle>
        </Alert>
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
