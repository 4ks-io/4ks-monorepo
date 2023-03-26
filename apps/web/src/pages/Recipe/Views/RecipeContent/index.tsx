import React from 'react';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeInstructions } from './RecipeInstructions';
import { RecipeSocial } from './RecipeSocial';
import { RecipeEditingControls } from './RecipeEditingControls';
import CircularProgress from '@mui/material/CircularProgress';
import { useRecipeContext } from '../../../../providers';

type RecipeProps = {
  create?: boolean;
};

const RecipeContentView = ({ create = false }: RecipeProps) => {
  const rtx = useRecipeContext();

  if (!rtx || !rtx.recipe) {
    return <CircularProgress />;
  }

  return (
    <>
      <RecipeEditingControls create={create} />
      <RecipeIngredients />
      <RecipeInstructions />
      <RecipeSocial />
    </>
  );
};

export { RecipeContentView };
export default { RecipeContentView };
