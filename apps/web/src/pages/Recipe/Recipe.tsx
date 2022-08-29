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
import { stackStyles, itemAlignmentsStackTokens } from './styles';
import { RecipeSummary } from './RecipeSummary';
import RecipeLoading from './RecipeLoading';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { models_Recipe, dtos_UpdateRecipe } from '@4ks/api-fetch';

const Recipe: React.FunctionComponent = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const ctx = useSessionContext();
  const rtx = useRecipeContext();

  if (!rtx || !rtx.recipe) {
    return <RecipeLoading />;
  }

  function debugRecipe() {
    // console.log(rtx?.recipe.currentRevision?.ingredients);
    console.log(rtx?.recipe.currentRevision?.instructions);
  }

  function saveRecipe() {
    if (rtx?.recipeId == '0') {
      ctx?.api?.recipes
        .postRecipes(rtx?.recipe.currentRevision as dtos_UpdateRecipe)
        .then((data: models_Recipe) =>
          navigate(`/recipes/${data.id}`, { replace: true })
        );
    } else {
      ctx?.api?.recipes.patchRecipes(
        `${rtx?.recipeId}`,
        rtx?.recipe.currentRevision as dtos_UpdateRecipe
      );
    }
  }

  return (
    <PageLayout>
      <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
        <RecipeHeader />
        <RecipeControls />
        {isAuthenticated && (
          <PrimaryButton
            text="Debug"
            onClick={debugRecipe}
            allowDisabledFocus
          />
        )}
        {isAuthenticated && (
          <PrimaryButton
            disabled={false}
            text="Save Changes"
            onClick={saveRecipe}
            allowDisabledFocus
          />
        )}
        <RecipeSummary />
        <RecipeIngredients />
        <RecipeInstructions />
        <RecipeSocial />
      </Stack>
    </PageLayout>
  );
};

export default Recipe;
