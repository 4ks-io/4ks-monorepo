import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHits } from 'react-instantsearch-hooks-web';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import RecipeCard from './RecipeCard';

const Recipes = () => {
  const navigate = useNavigate();
  const { hits } = useHits();

  function navigateNewRecipe() {
    navigate('/r/0');
  }

  function NewRecipeButton() {
    return (
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          margin: 0,
          top: 'auto',
          right: 20,
          bottom: 20,
          left: 'auto',
          position: 'fixed',
        }}
        onClick={navigateNewRecipe}
      >
        <AddIcon />
      </Fab>
    );
  }

  return (
    <Container style={{ marginTop: 20 }}>
      <NewRecipeButton />
      <Grid container spacing={1}>
        {hits.map((h) => (
          <Grid xs={12} md={6} lg={4} key={h.objectID}>
            <RecipeCard
              key={h.objectID}
              id={`${h['id']}`}
              title={`${h['name']}`}
              chef={`${h['author']}`}
              imageUrl={`${h['imageUrl']}`}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Recipes;
