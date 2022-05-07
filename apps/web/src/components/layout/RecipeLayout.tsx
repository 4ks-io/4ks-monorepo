import React from 'react';
import { Grid } from '@mantine/core';
import {
  RecipeDetails,
  RecipeEquipments,
  RecipeIngrediants,
  RecipeSummary,
  RecipeInstructions,
  RecipeHeader,
} from '../recipe';

interface IRecipeLayoutProps {}

export function RecipeLayout(props: IRecipeLayoutProps) {
  return (
    <>
      <RecipeHeader />
      <Grid grow gutter="xs" columns={12} style={{ marginTop: '64px' }}>
        <Grid.Col span={4}>
          <RecipeSummary />
        </Grid.Col>
        <Grid.Col span={4}>
          <RecipeDetails />
        </Grid.Col>
        <Grid.Col span={4}>
          <RecipeEquipments />
        </Grid.Col>
        <Grid.Col span={4}>
          <RecipeIngrediants />
        </Grid.Col>
        <Grid.Col span={8}>
          <RecipeInstructions />
        </Grid.Col>
      </Grid>
    </>
  );
}

export default RecipeLayout;
