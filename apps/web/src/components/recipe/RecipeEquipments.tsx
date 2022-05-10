import React from 'react';
import { Checkbox, Grid } from '@mantine/core';

interface IRecipeEquipmentsProps {}

export function RecipeEquipments(props: IRecipeEquipmentsProps) {
  const mockEquipment = ['1 bowl', '1 spoon', '1 oven'];
  return (
    <Grid.Col md={4} lg={4}>
      <div style={{ borderStyle: 'solid' }}>
        Equipment
        <ul style={{ listStyleType: 'none', paddingLeft: '8px' }}>
          {mockEquipment.map((e, i) => {
            return (
              <li key={i} style={{ marginBottom: '8px' }}>
                <Checkbox label={e} />
              </li>
            );
          })}
        </ul>
      </div>
    </Grid.Col>
  );
}

export default RecipeEquipments;
