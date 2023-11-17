import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useRecipeContext } from '../../../../providers';
import { useSessionContext } from '../../../../providers';
import {
  models_Recipe,
  dtos_UpdateRecipe,
  models_UserSummary,
} from '@4ks/api-fetch';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

  const [saveSucess, setSaveSucess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  async function saveRecipeChanges() {
    // handle new recipe
    if (create) {
      ctx?.api?.recipes
        .postRecipes(rtx?.recipe.currentRevision as dtos_UpdateRecipe)
        .then((data: models_Recipe) => navigate(`/r/${data.id}`));
      return;
    }

    // contributors can edit
    const isContributor = (rtx?.recipe.contributors as models_UserSummary[])
      .map((c) => c.id)
      .includes(ctx.user?.id);

    if (isContributor) {
      try {
        const r = await ctx?.api?.recipes.patchRecipes(
          `${rtx?.recipeId}`,
          rtx?.recipe.currentRevision as dtos_UpdateRecipe
        );
        setSaveSucess(true);
      } catch {
        setSaveError(true);
      }

      return;
    }

    // fork recipe
    ctx.api?.recipes.postRecipesFork(`${rtx?.recipeId}`).then((r) => {
      navigate(`/r/${r.id}`);
    });
  }

  function discardRecipeChanges() {
    rtx?.resetRecipe();
  }

  function handleClose(event?: React.SyntheticEvent | Event, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }

    setSaveSucess(false);
    setSaveError(false);
  }

  return (
    <>
      <Snackbar open={saveSucess} autoHideDuration={2000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          // sx={{ width: '100%' }}
        >
          Save successful!
        </Alert>
      </Snackbar>
      <Snackbar open={saveError} autoHideDuration={2000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          // sx={{ width: '100%' }}
        >
          Failed to save.
        </Alert>
      </Snackbar>
      {isAuthenticated && (
        <>
          <Fab
            color="primary"
            aria-label="save"
            sx={{
              margin: 0,
              top: 'auto',
              right: 20,
              bottom: 20,
              left: 'auto',
              position: 'fixed',
            }}
            onClick={saveRecipeChanges}
          >
            <SaveIcon />
          </Fab>
          <Fab
            size="small"
            color="secondary"
            aria-label="discard"
            sx={{
              margin: 0,
              top: 'auto',
              right: 80,
              bottom: 20,
              left: 'auto',
              position: 'fixed',
            }}
            onClick={discardRecipeChanges}
          >
            <CloseIcon />
          </Fab>
        </>
      )}
    </>
  );
}
