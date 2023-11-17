'use client';
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';

export default function NewRecipeButton() {
  const router = useRouter();

  return (
    <Tooltip title="Create" placement="top-start">
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          margin: 0,
          top: 'auto',
          right: 20,
          bottom: 20,
          left: 'auto',
          position: 'fixed',
        }}
        onClick={() => router.push('/recipe/0')}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  );
}
