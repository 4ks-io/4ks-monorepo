import React from 'react';
import { Grid, Card, Text, Group } from '@mantine/core';

interface IRecipeSummaryProps {}

export function RecipeSummary(props: IRecipeSummaryProps) {
  return (
    <Grid.Col md={6} lg={6}>
      <Card shadow="sm" p="lg">
        <Grid grow gutter="xs">
          <Grid.Col span={4}>
            <h2>Caramel Crunch–Chocolate Chunklet Cookies</h2>
            <h3>by Dorie Greenspan, from Samantha Seneviratne</h3>
          </Grid.Col>
        </Grid>
      </Card>
    </Grid.Col>
  );
}

export default RecipeSummary;
