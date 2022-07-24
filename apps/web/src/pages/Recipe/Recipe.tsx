import React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { useRecipeContext } from '../../providers/recipe-context';
import { PageLayout } from '../Layout';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeInstructions } from './RecipeInstructions';
import { RecipeHeader } from './RecipeHeader';
import { RecipeControls } from './RecipeControls';
import { RecipeSocial } from './RecipeSocial';
import { DragDropContext } from 'react-beautiful-dnd';
import { stackStyles, itemAlignmentsStackTokens } from './styles';
import { RecipeSummary } from './RecipeSummary';
import RecipeLoading from './RecipeLoading';

const Recipe: React.FunctionComponent = () => {
  const rtx = useRecipeContext();

  if (!rtx.recipe) {
    return <RecipeLoading />;
  }

  return (
    <PageLayout>
      <DragDropContext>
        <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
          <RecipeHeader />
          <RecipeControls />
          <RecipeSummary />
          <RecipeIngredients />
          <RecipeInstructions />
          <RecipeSocial />
        </Stack>
      </DragDropContext>
    </PageLayout>
  );
};

export default Recipe;
