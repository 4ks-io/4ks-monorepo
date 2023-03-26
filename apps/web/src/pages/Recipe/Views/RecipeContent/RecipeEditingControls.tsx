import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useRecipeContext } from '../../../../providers';
import { useSessionContext } from '../../../../providers';
import {
  models_Recipe,
  dtos_UpdateRecipe,
  models_UserSummary,
} from '@4ks/api-fetch';

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
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) {
    rtx?.editing != checked && rtx?.setEditing(checked);
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
    <Stack direction="row" spacing={2}>
      <FormControlLabel
        sx={{ color: 'text.primary' }}
        control={<Switch onChange={toggleEditing} defaultChecked={create} />}
        label="edit"
      />

      {rtx?.editing && (
        <>
          <Button
            variant="contained"
            disabled={!isAuthenticated}
            onClick={saveRecipe}
          >
            Save
          </Button>
          <Button variant="outlined" onClick={rtx?.resetRecipe}>
            Discard
          </Button>
        </>
      )}
    </Stack>
  );
}
