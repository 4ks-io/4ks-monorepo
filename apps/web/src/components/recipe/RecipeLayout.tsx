import React from 'react';
import { Grid } from '@mantine/core';
import {
  RecipeDetails,
  RecipeEquipments,
  RecipeIngredients,
  RecipeSummary,
  RecipeInstructions,
  RecipeHeader,
} from '.';

interface IRecipeLayoutProps {}

export function RecipeLayout(props: IRecipeLayoutProps) {
  return (
    <>
      <RecipeHeader />
      <Grid grow gutter="xs" columns={12} style={{ marginTop: '16px' }}>
        <RecipeSummary />
        <RecipeDetails />
        <RecipeEquipments />
        <RecipeIngredients />
        <RecipeInstructions />
      </Grid>
    </>
  );
}

export default RecipeLayout;
