import React, { useEffect, useState } from 'react';
import { Stack, IStackProps, IStackTokens } from '@fluentui/react/lib/Stack';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { useSessionContext } from '../../providers/session-context';
import { models_Recipe } from '@4ks/api-fetch';
import { PageLayout } from '../Layout';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeInstructions } from './RecipeInstructions';
import { RecipeHeader } from './RecipeHeader';
import { RecipeControls } from './RecipeControls';
import { RecipeSocial } from './RecipeSocial';
import { DragDropContext } from 'react-beautiful-dnd';

import { stackStyles, itemAlignmentsStackTokens } from './styles';
import { RecipeSummary } from './RecipeSummary';

const Recipe: React.FunctionComponent = () => {
  const ctx = useSessionContext();
  const [recipeId, setRecipeId] = useState<string | undefined>();

  useEffect(() => {
    setRecipeId(window.location.href.split('/').pop());
  }, []);

  const [recipe, setRecipe] = useState<models_Recipe | undefined>();

  useEffect(() => {
    if (ctx?.api && recipeId) {
      ctx.api.recipes.getRecipes1(recipeId).then((r) => {
        setRecipe(r);
      });
    }
  }, [ctx, recipeId]);

  if (!recipe) {
    const rowProps: IStackProps = { horizontal: true, verticalAlign: 'center' };
    const tokens = {
      sectionStack: {
        childrenGap: 10,
      },
      spinnerStack: {
        childrenGap: 20,
      },
    };

    return (
      <Stack {...rowProps} tokens={tokens.spinnerStack}>
        <Spinner size={SpinnerSize.large} />
      </Stack>
    );
  }

  return (
    <PageLayout>
      <DragDropContext>
        <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
          <RecipeHeader recipe={recipe} />
          <RecipeControls />
          <RecipeSummary recipe={recipe} />
          <RecipeIngredients data={recipe.currentRevision?.ingredients} />
          <RecipeInstructions data={recipe.currentRevision?.instructions} />
          <RecipeSocial data={recipe.contributors} />
        </Stack>
      </DragDropContext>
    </PageLayout>
  );
};

export default Recipe;
