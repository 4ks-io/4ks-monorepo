import React from 'react';
import { Grid } from '@mantine/core';
import { Card, Text, Group } from '@mantine/core';

interface IRecipeEquipmentsProps {}

export function RecipeEquipments(props: IRecipeEquipmentsProps) {
  return (
    <Card shadow="sm" p="lg">
      <Group position="apart">
        <Text weight={500}>Equipment</Text>
      </Group>

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

export default RecipeEquipments;
