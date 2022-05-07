import React from 'react';
import { Grid, SimpleGrid } from '@mantine/core';
import {
  RecipeDetails,
  RecipeEquipments,
  RecipeIngredients,
  RecipeSummary,
  RecipeInstructions,
  RecipeHeader,
} from '../recipe';

interface IRecipeLayoutProps {}

export function RecipeLayout(props: IRecipeLayoutProps) {
  return (
    <>
      <RecipeHeader />
      {/* <SimpleGrid
        cols={4}
        spacing="lg"
        breakpoints={[
          { maxWidth: 980, cols: 3, spacing: 'md' },
          { maxWidth: 755, cols: 2, spacing: 'sm' },
          { maxWidth: 600, cols: 1, spacing: 'sm' },
        ]}
      >
        <RecipeSummary />
        <RecipeDetails />
        <RecipeEquipments />
        <RecipeIngredients />
        <RecipeInstructions />
      </SimpleGrid> */}

      <Grid grow gutter="xs" columns={12} style={{ marginTop: '16px' }}>
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
          <RecipeIngredients />
        </Grid.Col>
        <Grid.Col span={8}>
          <RecipeInstructions />
        </Grid.Col>
      </Grid>
    </>
  );
}

export default RecipeLayout;
