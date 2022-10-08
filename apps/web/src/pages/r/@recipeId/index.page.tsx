import React from 'react';
import { RecipeContextProvider } from '../../../providers/recipe-context';
import Recipe from './Recipe';

export const documentProps = {
  title: '4ks',
  description: '{{Insert Recipe Name?}}',
};

export function Page() {
  return (
    <RecipeContextProvider>
      <Recipe />
    </RecipeContextProvider>
  );
}
