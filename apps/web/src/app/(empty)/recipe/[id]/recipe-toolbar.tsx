'use client';
import React, { useState, useEffect } from 'react';
import Toolbar from '@mui/material/Toolbar';
import { usePathname } from 'next/navigation';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useRouter } from 'next/navigation';
import GenericErrorBoundary from '@/components/generic-error-boundary';
import { models_User, models_Recipe } from '@4ks/api-fetch';
import { normalizeForURL } from '@/libs/navigation';

type RecipeToolbarProps = {
  user: models_User | undefined;
  recipe: models_Recipe;
};

export default function RecipeToolbar({ user, recipe }: RecipeToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user?.id;
  const isNew = recipe?.id == '0';
  const isAuthor = user && recipe.author?.id === user.id;
  const isContributor =
    user &&
    recipe?.contributors &&
    recipe?.contributors.map((c) => c.id).includes(user?.id);

  // tr@ck: handle name change
  let recipeURL = `/recipe/${recipe.id}`;
  if (recipe?.currentRevision?.name) {
    recipeURL = `/recipe/${recipe.id}-${normalizeForURL(
      recipe?.currentRevision?.name
    )}`;
  }

  function getPath(p: string) {
    const path = p.split('/');
    if (path.length == 3) {
      return '';
    }
    // handle path
    const page = path[3] || '';
    return page;
  }

  const [value, setValue] = React.useState<string>(getPath(pathname));

  useEffect(() => {
    setValue(getPath(pathname));
  }, [pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    router.push(recipeURL + '/' + newValue);
  };

  return (
    <Toolbar
      variant="dense"
      sx={{
        borderBottom: '1px solid #F7F9FB',
      }}
    >
      <GenericErrorBoundary>
        <Tabs
          sx={{ height: 24 }}
          value={value}
          onChange={handleChange}
          aria-label="page navigation"
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Recipe" value="" />
          <Tab label="Forks" value="forks" disabled={isNew} />
          <Tab label="Media" value="media" disabled={isNew} />
          <Tab label="Versions" value="versions" disabled={isNew} />
          {isAuthenticated && isContributor && (
            <Tab label="Settings" value="settings" disabled={!isAuthor} />
          )}
        </Tabs>
      </GenericErrorBoundary>
    </Toolbar>
  );
}
