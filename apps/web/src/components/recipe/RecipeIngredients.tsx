import React from 'react';
import { Checkbox, Grid } from '@mantine/core';

interface IRecipeIngredientsProps {}

export function RecipeIngredients(props: IRecipeIngredientsProps) {
  const mockIngredients = [
    '2 sticks (8 ounces; 226 grams) unsalted butter, cut into chunks, at room temperature',
    '½ cups (100 grams) sugar',
    "½ cups (60 grams) confectioners' sugar",
    '½ teaspoons fine sea salt',
    '1 teaspoon pure vanilla extract',
    '2 cups (272 grams) all-purpose flour',
    '3 ounces (85 grams) dark or milk chocolate chopped into small chunks',
    'about ½ cups (60 grams) coarsely chopped walnuts, toasted or not (or more chocolate chunks)',
  ];
  return (
    <Grid.Col md={4} lg={4}>
      <div style={{ borderStyle: 'solid' }}>
        Ingredients
        <ul style={{ listStyleType: 'none', paddingLeft: '8px' }}>
          {mockIngredients.map((i, n) => {
            return (
              <li key={n} style={{ marginBottom: '8px' }}>
                <Checkbox label={i} />
              </li>
            );
          })}
        </ul>
      </div>
    </Grid.Col>
  );
}

export default RecipeIngredients;
