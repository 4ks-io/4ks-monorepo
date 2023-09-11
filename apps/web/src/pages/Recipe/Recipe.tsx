import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { Outlet } from 'react-router-dom';
import { RecipeHeader } from './Views/RecipeHeader';
import { RecipeHelmet } from './Views/RecipeHelmet';
import { RecipeControls } from './Views/RecipeControls';
import { RecipeContextProvider } from '../../providers';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

const Recipe = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <RecipeContextProvider>
      <RecipeHelmet />
      <Container style={{ paddingTop: 16, paddingBottom: 100 }}>
        <Stack>
          <RecipeHeader />
          {!isAuthenticated && (
            <Container style={{ paddingTop: 16, paddingBottom: 16 }}>
              <Alert severity="warning">
                <AlertTitle>Info</AlertTitle>
                <strong>Login</strong> to save!
              </Alert>
            </Container>
          )}
          <RecipeControls />
          <Outlet />
        </Stack>
      </Container>
    </RecipeContextProvider>
  );
};

export default Recipe;
