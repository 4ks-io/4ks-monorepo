import React from 'react';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeInstructions } from './RecipeInstructions';
import { RecipeSocial } from './RecipeSocial';
import { RecipeEditingControls } from './RecipeEditingControls';
import { RecipeFontControls } from './RecipeFontControls';
import RecipeLoading from './RecipeLoading';
import { useRecipeContext } from '../../../../providers/recipe-context';

type RecipeProps = {
  create?: boolean;
};

const RecipeContentView = ({ create }: RecipeProps) => {
  const rtx = useRecipeContext();

  if (!rtx || !rtx.recipe) {
    return <RecipeLoading />;
  }

  return (
    <>
      <RecipeEditingControls />
      {/* <RecipeSummary /> */}
      <RecipeIngredients />
      <RecipeInstructions />
      <RecipeSocial />
      <RecipeFontControls />
    </>
  );
};

export { RecipeContentView };
export default { RecipeContentView };
