import React from 'react';
import { SectionTitle } from '../components';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSessionContext } from '../../../../providers';
import { useRecipeContext } from '../../../../providers';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

interface RecipeDangerZoneProps {}

export function RecipeDangerZone({}: RecipeDangerZoneProps) {
  const ctx = useSessionContext();
  const rtx = useRecipeContext();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (rtx?.recipeId) {
      ctx.api?.recipes.deleteRecipes(rtx.recipeId).then(() => navigate(`/r`));
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <SectionTitle value={'Danger Zone'} />
        <div>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            startIcon={<DeleteIcon />}
          >
            Delete Recipe
          </Button>
        </div>
      </Stack>
    </Box>
  );
}
