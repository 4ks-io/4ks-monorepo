import React, { useEffect, useState } from 'react';
import { useSessionContext } from '../../../../providers/session-context';
import { useRecipeContext } from '../../../../providers/recipe-context';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeInstructions } from './RecipeInstructions';
import { RecipeSocial } from './RecipeSocial';
import { RecipeDangerZone } from './RecipeDangerZone';
import { stackStyles, itemAlignmentsStackTokens } from './../../styles';
import { RecipeSummary } from './RecipeSummary';
import RecipeLoading from './RecipeLoading';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { models_Recipe, dtos_UpdateRecipe } from '@4ks/api-fetch';
import FontSizeChanger from 'react-font-size-changer';
import { IconButton } from '@fluentui/react/lib/Button';

type RecipeProps = {
  create?: boolean;
};

const RecipeContentView = ({ create }: RecipeProps) => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const ctx = useSessionContext();
  const rtx = useRecipeContext();

  const [isRecipeContributor, setIsRecipeContributor] = useState(false);

  useEffect(() => {
    setIsRecipeContributor(
      (isAuthenticated &&
        rtx?.recipe.contributors?.map((c) => c.id).includes(ctx.user?.id)) ||
        false
    );
  }, [rtx, ctx.user]);

  if (!rtx || !rtx.recipe) {
    return <RecipeLoading />;
  }

  function saveRecipe() {
    if (create) {
      ctx?.api?.recipes
        .postRecipes(rtx?.recipe.currentRevision as dtos_UpdateRecipe)
        .then((data: models_Recipe) =>
          navigate(`/r/${data.id}`, { replace: true })
        );
    } else {
      ctx?.api?.recipes.patchRecipes(
        `${rtx?.recipeId}`,
        rtx?.recipe.currentRevision as dtos_UpdateRecipe
      );
    }
  }

  return (
    <>
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

      <FontSizeChanger
        targets={['#target .contentResizer']}
        // onChange={(element: any, newValue: any, oldValue: any) => {
        //   console.log(element, newValue, oldValue);
        // }}
        options={{
          stepSize: 2,
          range: 3,
        }}
        customButtons={{
          up: (
            <IconButton
              iconProps={{ iconName: 'ZoomIn' }}
              title="Emoji"
              ariaLabel="ZoomIn"
            />
          ),
          down: (
            <IconButton
              iconProps={{ iconName: 'ZoomOut' }}
              title="Emoji"
              ariaLabel="ZoomOut"
            />
          ),
          style: {
            color: 'white',
          },
          buttonsMargin: 2,
        }}
      />

      {rtx?.recipeId && rtx?.recipeId != '0' && isRecipeContributor && (
        <RecipeDangerZone />
      )}
    </>
  );
};

export { RecipeContentView };
export default { RecipeContentView };
