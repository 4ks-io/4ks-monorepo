import * as React from 'react';
import ExploreSearch from '@/components/ExploreSearch';

import Box from '@mui/material/Box';

export default function RecipePage() {
  const apikey = `${process.env.TYPESENSE_API_KEY}`;
  const host = `${process.env.TYPESENSE_URL}`;
  const path = `${process.env.TYPESENSE_PATH}`;

  return (
    <Box sx={{ display: 'flex' }}>
      Explore
      <ExploreSearch apikey={apikey} host={host} path={path} />
    </Box>
  );
}
