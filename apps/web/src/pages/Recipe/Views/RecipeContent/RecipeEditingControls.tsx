import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@fluentui/react/lib/Stack';
import { Label } from '@fluentui/react/lib/Label';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { useRecipeContext } from '../../../../providers/recipe-context';
import { useSessionContext } from '../../../../providers/session-context';
import { models_Recipe, dtos_UpdateRecipe } from '@4ks/api-fetch';
import { IContextualMenuProps } from '@fluentui/react';
import { DefaultButton } from '@fluentui/react/lib/Button';

interface RecipeEditingControlsProps {
  create?: boolean;
}

export function RecipeEditingControls({ create }: RecipeEditingControlsProps) {
  const { isAuthenticated } = useAuth0();
  const rtx = useRecipeContext();
  const ctx = useSessionContext();
  const navigate = useNavigate();

  function toggleEditing() {
    rtx?.setEditing(!rtx?.editing);
  }

  function discardChanges() {}

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

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'discard',
        text: 'Discard Changes',
        iconProps: { iconName: 'Cancel' },
        onClick: discardChanges,
      },
    ],
  };

  return (
    <Stack.Item>
      <Stack horizontal horizontalAlign="space-between">
        <Stack.Item>
          <Toggle
            /* label={<div>Edit</div>} */ label="Edit"
            inlineLabel
            onChange={toggleEditing}
          />
        </Stack.Item>
        {rtx?.editing && isAuthenticated && (
          <Stack.Item>
            <DefaultButton
              text="Save Changes"
              split
              disabled={!isAuthenticated}
              splitButtonAriaLabel="See 2 options"
              aria-roledescription="split button"
              menuProps={menuProps}
              onClick={saveRecipe}
            />
          </Stack.Item>
        )}
      </Stack>
    </Stack.Item>
  );
}
