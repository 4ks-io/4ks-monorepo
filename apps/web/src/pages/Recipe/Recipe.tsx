import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Stack } from '@fluentui/react/lib/Stack';
import { RecipeHeader } from './Views/RecipeHeader';
import { RecipeHelmet } from './Views/RecipeHelmet';
import { RecipeControls } from './Views/RecipeControls';
import { stackStyles, itemAlignmentsStackTokens } from './styles';
import { RecipeContextProvider } from '../../providers';

const Recipe = () => {
  return (
    <RecipeContextProvider>
      <RecipeHelmet />
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
