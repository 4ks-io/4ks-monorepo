import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useRecipeContext } from '../../../providers';
import { useSessionContext } from '../../../providers';
import { models_UserSummary } from '@4ks/api-fetch';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export enum RecipeViews {
  Recipe = '',
  Media = '/m',
  Forks = '/f',
  Comments = '/c',
  // Story = "/s",
  Versions = '/v',
  Settings = '/s',
}

export function RecipeControls() {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  const ctx = useSessionContext();
  const rtx = useRecipeContext();
  const [value, setValue] = React.useState(0);

  const [isRecipeContributor, setIsRecipeContributor] = useState(false);

  const isNewRecipe = rtx?.recipeId && rtx?.recipeId != '0' ? false : true;
  const base = `/r/${rtx?.recipeId}`;

  useEffect(() => {
    setIsRecipeContributor(
      (isAuthenticated &&
        rtx?.recipe?.contributors
          ?.map((c: models_UserSummary) => c.id)
          .includes(ctx.user?.id)) ||
        false
    );
  }, [rtx, ctx.user]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue == 0) {
      location.pathname != '/r/0' && navigate(base + RecipeViews.Recipe);
    }
    newValue == 1 && navigate(base + RecipeViews.Forks);
    newValue == 2 && navigate(base + RecipeViews.Media);
    newValue == 3 && navigate(base + RecipeViews.Versions);
    newValue == 4 && navigate(base + RecipeViews.Settings);
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
