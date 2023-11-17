'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { RecipeProps } from '@/types/recipe';

export default function RecipeVersions({ user, recipe, media }: RecipeProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <div>
        Recipe Versions
        {/* <div>{JSON.stringify(data)}</div> */}
      </div>
    </Box>
  );
}
