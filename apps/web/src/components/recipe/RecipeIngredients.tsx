import React from 'react';
import { Grid } from '@mantine/core';

interface IRecipeIngredientsProps {}

export function RecipeIngredients(props: IRecipeIngredientsProps) {
  return (
    <div style={{ borderStyle: 'solid' }}>
      Ingredients
      <ul>
        <li>
          2 sticks (8 ounces; 226 grams) unsalted butter, cut into chunks, at
          room temperature
        </li>
        <li>½ cups (100 grams) sugar</li>
        <li>½ cups (60 grams) confectioners' sugar</li>
        <li>½ teaspoons fine sea salt</li>
        <li>1 teaspoon pure vanilla extract</li>
        <li>2 cups (272 grams) all-purpose flour</li>
        <li>
          3 ounces (85 grams) dark or milk chocolate chopped into small chunks
        </li>
        <li>
          about ½ cups (60 grams) coarsely chopped walnuts, toasted or not (or
          more chocolate chunks)
        </li>
      </ul>
    </div>
  );
}

export default RecipeIngredients;
