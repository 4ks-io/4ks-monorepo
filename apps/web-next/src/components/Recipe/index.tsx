'use client';
import React from 'react';
import { RecipeHeader } from './Views/RecipeHeader';
// import { RecipeControls } from './Views/RecipeControls';
import { RecipeContextProvider } from '@/providers/recipe-context';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { models_Recipe, models_User } from '@4ks/api-fetch';

type RecipeComponentProps = {
  recipe: models_Recipe;
  user: models_User | undefined;
};
export default function RecipeComponent({
  user,
  recipe,
}: RecipeComponentProps) {
  return (
    <>
      <div>{JSON.stringify(recipe)}</div>
      {/* {!session && (
            <Container style={{ paddingTop: 16, paddingBottom: 16 }}>
              <Alert severity="warning">
                <AlertTitle>Info</AlertTitle>
                <strong>Login</strong> to save!
              </Alert>
            </Container>
          )}
          <RecipeControls />
          <Outlet /> */}
    </>
  );
}
