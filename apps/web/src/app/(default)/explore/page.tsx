import * as React from 'react';
import { serverClient } from '@/trpc/serverClient';
import SearchResults from '@/components/SearchResults';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import NewRecipeButton from '@/components/NewRecipeButton';

export const metadata: Metadata = {
  title: '4ks Explore',
  description: '4ks Explore Recipes',
};

export default async function ExplorePage() {
  const data = await serverClient.search.recipes('');

  if (!data) {
    return (
      <div>
        <div>no results</div>
      </div>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        // mt: ['2px', '2px', '2px'],
        p: 3,
      }}
    >
      <NewRecipeButton />
      <SearchResults results={data} />
    </Box>
  );
}
