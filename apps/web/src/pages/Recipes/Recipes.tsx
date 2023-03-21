import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../../providers';
import { models_Recipe } from '@4ks/api-fetch';
import RecipeSearchTile from './RecipeSearchTile';
import RecipeTile from './RecipeTile';
import Skeleton from '@mui/material/Skeleton';
import { useHits } from 'react-instantsearch-hooks-web';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import RecipeCard from './RecipeCard';

const Recipes = () => {
  const ctx = useSessionContext();
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<models_Recipe[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { hits } = useHits();

  useEffect(() => {
    ctx.api?.recipes.getRecipes().then((r: models_Recipe[]) => {
      setRecipes(r);
      setIsLoading(false);
    });
  }, [ctx]);

  function navigateNewRecipe() {
    navigate('/r/0');
  }

  function NewRecipeButton() {
    return isAuthenticated ? (
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
    ) : null;
  }

  function RecipesFromCollection() {
    return (
      <>
        {recipes &&
          recipes.map((r) => (
            <Grid xs={12} md={6} lg={4} key={r.id}>
              <RecipeTile key={r.id} recipe={r} />
            </Grid>
          ))}
      </>
    );
  }

  function RecipesFromSearch() {
    return (
      <>
        {hits.map((h) => (
          <Grid xs={12} md={6} lg={4} key={h.objectID}>
            <RecipeSearchTile key={h.objectID} id={h.objectID} />
          </Grid>
        ))}
      </>
    );
  }

  if (isLoading) {
    return (
      <Container style={{ marginTop: 40 }}>
        <Grid container spacing={2}>
          {[...Array(10).keys()].map((n) => (
            <Grid xs={12} md={6} lg={4} key={n}>
              <RecipeCard loading />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: 40 }}>
      <NewRecipeButton />
      <Grid container spacing={2}>
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
