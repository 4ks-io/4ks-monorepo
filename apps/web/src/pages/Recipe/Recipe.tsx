import React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { useSessionContext } from '../../providers/session-context';
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
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useAuth0 } from '@auth0/auth0-react';

const Recipe: React.FunctionComponent = () => {
  const { isAuthenticated } = useAuth0();
  const ctx = useSessionContext();
  const rtx = useRecipeContext();

  if (!rtx || !rtx.recipe) {
    return <RecipeLoading />;
  }

  return (
    <PageLayout>
      <DragDropContext>
        <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
          <RecipeHeader />
          <RecipeControls />
          {isAuthenticated && (
            <PrimaryButton
              disabled={false}
              text="Save Changes"
              onClick={rtx?.onSave}
              allowDisabledFocus
            />
          )}
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
