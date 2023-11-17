'use client';
import * as React from 'react';
import { RecipeProps } from '@/types/recipe';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { SectionTitle } from '@/components/Recipe/SectionTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { useRecipeContext } from '@/providers/recipe-context';
import { models_Recipe } from '@4ks/api-fetch';

type RecipeSettingsProps = {
  recipe: models_Recipe;
};

export default function RecipeSettings({ recipe }: RecipeSettingsProps) {
  const router = useRouter();
  const deleteMutation = trpc.recipes.delete.useMutation();
  const [open, setOpen] = React.useState(false);
  const [deleteMutex, setDeleteMutex] = React.useState(false);
  const rtx = useRecipeContext();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const { isLoading, isSuccess } = deleteMutation;
    if (!deleteMutex || isLoading) {
      return;
    }

    setDeleteMutex(false);
    rtx.setActionInProgress(false);

    if (isSuccess) {
      router.push('/');
    }
    // error
    // todo: handle error

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteMutex, deleteMutation]);

  const handleDelete = () => {
    if (!recipe.id) {
      return;
    }
    setDeleteMutex(true);
    rtx.setActionInProgress(true);
    deleteMutation.mutate(recipe.id);
    setOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to <b>delete this recipe</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Stack spacing={2}>
        <SectionTitle value={'Danger Zone'} />
        <div>
          <Button
            variant="contained"
            color="error"
            onClick={handleClickOpen}
            startIcon={<DeleteIcon />}
          >
            Delete Recipe
          </Button>
        </div>
      </Stack>
    </Box>
  );
}
