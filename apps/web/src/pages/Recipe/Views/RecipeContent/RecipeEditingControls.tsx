import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@fluentui/react/lib/Stack';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { useRecipeContext } from '../../../../providers/recipe-context';
import { useSessionContext } from '../../../../providers/session-context';
import {
  models_Recipe,
  dtos_UpdateRecipe,
  models_UserSummary,
} from '@4ks/api-fetch';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';

interface RecipeEditingControlsProps {
  create?: boolean;
}

export function RecipeEditingControls({
  create = false,
}: RecipeEditingControlsProps) {
  const { isAuthenticated } = useAuth0();
  const rtx = useRecipeContext();
  const ctx = useSessionContext();
  const navigate = useNavigate();

  function toggleEditing(
    event: React.MouseEvent<HTMLElement>,
    checked?: boolean
  ) {
    if (typeof checked !== 'undefined') {
      rtx?.setEditing(checked);
    }
  }

  function saveRecipe() {
    if (create) {
      ctx?.api?.recipes
        .postRecipes(rtx?.recipe.currentRevision as dtos_UpdateRecipe)
        .then((data: models_Recipe) => navigate(`/r/${data.id}`));
    } else {
      const isContributor = (rtx?.recipe.contributors as models_UserSummary[])
        .map((c) => c.id)
        .includes(ctx.user?.id);

      if (isContributor) {
        ctx?.api?.recipes.patchRecipes(
          `${rtx?.recipeId}`,
          rtx?.recipe.currentRevision as dtos_UpdateRecipe
        );
      } else {
        ctx.api?.recipes.postRecipesFork(`${rtx?.recipeId}`).then((r) => {
          navigate(`/r/${r.id}`);
        });
      }
    }
  }

  return (
    <Stack.Item>
      <Stack horizontal horizontalAlign="space-between">
        <Stack.Item>
          <Toggle
            label="Edit"
            inlineLabel
            onChange={toggleEditing}
            defaultChecked={create}
          />
        </Stack.Item>
        {rtx?.editing && (
          <Stack horizontal horizontalAlign="space-between">
            <Stack.Item style={{ paddingRight: 12 }}>
              <PrimaryButton
                text="Save"
                disabled={!isAuthenticated}
                onClick={saveRecipe}
              />
            </Stack.Item>

            <Stack.Item>
              <DefaultButton text="Discard" onClick={rtx?.resetRecipe} />
            </Stack.Item>
          </Stack>
        )}
      </Stack>
    </Stack.Item>
  );
}
