import * as React from 'react';
import Box from '@mui/material/Box';
import RecipeMediaView from '@/components/Recipe/RecipeMedia/RecipeMediaView';
import { getUserData } from '../data';
import log from '@/libs/logger';

export default async function RecipeMediaPage() {
  log().Debug(new Error(), 'RecipeMediaPage: root');
  // data
  // const [user] = await Promise.all([getUserData()]);
  return (
    <Box sx={{ display: 'flex' }}>
      <div>Recipe Media</div>
    </Box>
  );
  // return <RecipeMediaView user={user} />;
}
