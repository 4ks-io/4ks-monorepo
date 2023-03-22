import React from 'react';
import { Outlet } from 'react-router-dom';
import { RecipeHeader } from './Views/RecipeHeader';
import { RecipeHelmet } from './Views/RecipeHelmet';
import { RecipeControls } from './Views/RecipeControls';
import { RecipeContextProvider } from '../../providers';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

const Recipe = () => {
  return (
    <RecipeContextProvider>
      <RecipeHelmet />
      <Container style={{ paddingTop: 16 }}>
        <Stack>
          <RecipeHeader />
          <RecipeControls />
          <Container>
            <Outlet />
          </Container>
        </Stack>
      </Container>
    </RecipeContextProvider>
  );
};

export default Recipe;
