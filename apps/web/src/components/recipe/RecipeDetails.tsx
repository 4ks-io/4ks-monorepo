import React from 'react';
import { Grid } from '@mantine/core';
import { Card, Text, Group } from '@mantine/core';

interface IRecipeDetailsProps {}

export function RecipeDetails(props: IRecipeDetailsProps) {
  return (
    <Card shadow="sm" p="lg">
      <Grid grow gutter="xs">
        <Grid.Col span={4}>
          PREP TIME
          <br />2 hours 15 minutes
        </Grid.Col>
        <Grid.Col span={4}>
          COOK TIME
          <br />
          22 minutes
        </Grid.Col>
        <Grid.Col span={4}>
          MAKES
          <br />
          24
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default RecipeDetails;
