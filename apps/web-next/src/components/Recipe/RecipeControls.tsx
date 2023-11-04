'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useRecipeContext } from '@/providers/recipe-context';
import { models_UserSummary, models_User, models_Recipe } from '@4ks/api-fetch';
import Skeleton from '@mui/material/Skeleton';
import {
  RecipeView,
  RecipeViewPaths,
  normalizeForURL,
  RecipePageInfo,
} from '@/libs/navigation';
import log from '@/libs/logger';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {} from '@4ks/api-fetch';

type RecipeControlsProps = {
  page: RecipePageInfo;
  user: models_User | undefined;
  recipe: models_Recipe;
};

export function RecipeControls({ page, user, recipe }: RecipeControlsProps) {
  const isAuthenticated = !!user?.id;
  const pathname = usePathname();
  const router = useRouter();
  const rtx = useRecipeContext();

  const [value, setValue] = React.useState(selectTab());
  const [isRecipeContributor, setIsRecipeContributor] = useState(false);

  const isNewRecipe = rtx?.recipeId && rtx?.recipeId != '0' ? false : true;
  const titleURL = normalizeForURL(rtx?.recipe?.currentRevision?.name);
  const base = `/recipe/${rtx?.recipeId}-${titleURL}`;

  function selectTab() {
    switch (page.recipePageName) {
      case 'forks':
        return 1;
      case 'media':
        return 2;
      case 'versions':
        return 3;
      case 'settings':
        return 4;
      default:
        return 0;
    }
  }

  useEffect(() => {
    log().Debug(new Error(), 'RecipeControls: ' + JSON.stringify(page));
    setValue(selectTab());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    setIsRecipeContributor(
      (isAuthenticated &&
        rtx?.recipe?.contributors
          ?.map((c: models_UserSummary) => c.id)
          .includes(user?.id)) ||
        false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rtx, user]);

  if (!page) {
    return (
      <Skeleton sx={{ height: 280 }} animation="wave" variant="rectangular" />
    );
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue == 0) {
      pathname != '/recipe/0' && router.push(base + RecipeViewPaths.Recipe);
    }
    newValue == 1 && router.push(base + RecipeViewPaths.Forks);
    newValue == 2 && router.push(base + RecipeViewPaths.Media);
    newValue == 3 && router.push(base + RecipeViewPaths.Versions);
    newValue == 4 && router.push(base + RecipeViewPaths.Settings);
  };

  return (
    <Stack style={{ paddingTop: 16, paddingBottom: 16 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="page navigation"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Recipe" />
          <Tab label="Forks" disabled={isNewRecipe} />
          <Tab label="Media" disabled={isNewRecipe} />
          <Tab label="Versions" disabled={isNewRecipe} />
          {!isNewRecipe && isRecipeContributor && <Tab label="Settings" />}
        </Tabs>
      </Box>
    </Stack>
  );
}
