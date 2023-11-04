import * as React from 'react';
import { notFound } from 'next/navigation';
import { getRecipePageInfo } from '@/libs/navigation';
import { getRecipeData, getUserData } from './data';
import RecipeEditingControls from '@/components/Recipe/RecipeContent/RecipeEditingControls';
import RecipeIngredients from '@/components/Recipe/RecipeContent/RecipeIngredients';
import RecipeInstructions from '@/components/Recipe/RecipeContent/RecipeInstructions';
import RecipeSocial from '@/components/Recipe/RecipeContent/RecipeSocial';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import log from '@/libs/logger';
import { headers } from 'next/headers';

export default async function RecipePage() {
  const page = getRecipePageInfo(headers());
  log().Debug(new Error(), 'page: RecipePage ' + page.pathname);

  // data
  const [user, recipe] = await Promise.all([
    getUserData(),
    getRecipeData(page.recipeID),
  ]);

  if (!recipe?.data) {
    log().Error(new Error(), 'RecipePage: failed to fetch recipe');
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
