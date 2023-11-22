'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { RecipeProps } from '@/types/recipe';

export default function RecipeForks({ user, recipe }: RecipeProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <div>
        Recipe Forks
        {/* <div>{JSON.stringify(data)}</div> */}
      </div>
    </Box>
  );
}
