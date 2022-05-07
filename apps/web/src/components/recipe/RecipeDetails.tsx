import React from 'react';
import { Grid, Card, Text, Group } from '@mantine/core';

interface IRecipeDetailsProps {}

export function RecipeDetails(props: IRecipeDetailsProps) {
  return (
    <Grid.Col md={6} lg={6}>
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
    </Grid.Col>
  );
}

export default RecipeDetails;
