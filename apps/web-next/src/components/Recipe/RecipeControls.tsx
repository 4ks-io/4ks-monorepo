'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useRecipeContext } from '@/providers/recipe-context';
import { models_UserSummary, models_User, models_Recipe } from '@4ks/api-fetch';
import { normalizeForURL } from '@/libs/navigation';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {} from '@4ks/api-fetch';

// todo: i18n
export enum RecipeViews {
  Recipe = '',
  Media = '/media',
  Forks = '/forks',
  Comments = '/comments',
  // Story = "/story",
  Versions = '/versions',
  Settings = '/settings',
}

type RecipeControlsProps = {
  user: models_User | undefined;
  recipe: models_Recipe;
};

export function RecipeControls({ user, recipe }: RecipeControlsProps) {
  const isAuthenticated = !!user?.id;
  const pathname = usePathname();
  const router = useRouter();
  const rtx = useRecipeContext();

  const [value, setValue] = React.useState(0);
  const [isRecipeContributor, setIsRecipeContributor] = useState(false);

  const isNewRecipe = rtx?.recipeId && rtx?.recipeId != '0' ? false : true;
  const titleURL = normalizeForURL(rtx?.recipe?.currentRevision?.name);
  const base = `/recipe/${titleURL}/${rtx?.recipeId}`;

  useEffect(() => {
    setIsRecipeContributor(
      (isAuthenticated &&
        rtx?.recipe?.contributors
          ?.map((c: models_UserSummary) => c.id)
          .includes(user?.id)) ||
        false
    );
  }, [rtx, user]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue == 0) {
      pathname != '/recipe/0' && router.push(base + RecipeViews.Recipe);
    }
    newValue == 1 && router.push(base + RecipeViews.Forks);
    newValue == 2 && router.push(base + RecipeViews.Media);
    newValue == 3 && router.push(base + RecipeViews.Versions);
    newValue == 4 && router.push(base + RecipeViews.Settings);
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
