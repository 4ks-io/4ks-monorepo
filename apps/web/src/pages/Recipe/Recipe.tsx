import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Stack } from '@fluentui/react/lib/Stack';
import { RecipeHeader } from './RecipeHeader';
import { RecipeControls } from './RecipeControls';
import { stackStyles, itemAlignmentsStackTokens } from './styles';
import { RecipeContextProvider } from '../../providers/recipe-context';

type RecipeProps = {
  create?: boolean;
};

const Recipe = ({ create = false }: RecipeProps) => {
  return (
    <RecipeContextProvider>
      <Stack
        styles={stackStyles}
        tokens={itemAlignmentsStackTokens}
        id="target"
      >
        <RecipeHeader />
        <RecipeControls />
        <Outlet />
      </Stack>
    </RecipeContextProvider>
  );
};

export default Recipe;
