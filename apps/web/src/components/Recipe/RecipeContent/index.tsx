'use client';
import React from 'react';
import RecipeIngredients from './RecipeIngredients';
import RecipeInstructions from './RecipeInstructions';
import RecipeSocial from './RecipeSocial';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { RecipeProps } from '@/types/recipe';
import { useRecipeContext } from '@/providers/recipe-context';
import Box from '@mui/material/Box';

export default function Recipe({ user, recipe }: RecipeProps) {
  const isAuthenticated = !!user?.id;
  const rtx = useRecipeContext();

  const isNew = recipe?.id == '0';
  const isContributor = rtx.recipe.contributors?.some((c) => {
    return user?.id == c.id;
  });

  return (
    <Box sx={{ m: 1, position: 'relative' }}>
      {!isAuthenticated && rtx.editInProgress && (
        <Alert severity="warning">
          <AlertTitle>
            <strong>Login</strong> to save
          </AlertTitle>
        </Alert>
      )}
      {isAuthenticated && !isNew && !isContributor && rtx.editInProgress && (
        <Alert severity="warning">
          <AlertTitle>
            <strong>Fork</strong> to save
          </AlertTitle>
        </Alert>
      )}
      <RecipeIngredients
        ingredients={recipe.currentRevision?.ingredients || []}
      />
      <div style={{ paddingBottom: 30 }} />
      <RecipeInstructions
        instructions={recipe.currentRevision?.instructions || []}
      />
      <div style={{ paddingBottom: 30 }} />
      <RecipeSocial />
    </Box>
  );
}
