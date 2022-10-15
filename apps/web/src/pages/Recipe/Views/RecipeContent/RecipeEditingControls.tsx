import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Label } from '@fluentui/react/lib/Label';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { useRecipeContext } from '../../../../providers/recipe-context';

interface RecipeEditingControlsProps {}

export function RecipeEditingControls() {
  const { isAuthenticated } = useAuth0();
  const rtx = useRecipeContext();

  function toggleEditing() {
    rtx?.setEditing(!rtx?.editing);
  }

  return (
    <Stack.Item align="end">
      <Toggle
        /* label={<div>Edit</div>} */ label="Edit"
        inlineLabel
        onChange={toggleEditing}
      />
      {rtx?.editing && isAuthenticated && (
        <>
          <Label>Save</Label>
          <Label>Discard</Label>
        </>
      )}
    </Stack.Item>
  );
}
