import React from 'react';
import { Grid } from '@mantine/core';
import { Card, Text, Group } from '@mantine/core';

interface IRecipeSummaryProps {}

export function RecipeSummary(props: IRecipeSummaryProps) {
  return (
    <Card shadow="sm" p="lg">
      <Group position="apart">
        <Text weight={500}>Summary</Text>
      </Group>

      <Grid grow gutter="xs">
        <Grid.Col span={4}>
          Caramel Crunch–Chocolate Chunklet Cookies by Dorie Greenspan, from
          Samantha Seneviratne
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default RecipeSummary;
