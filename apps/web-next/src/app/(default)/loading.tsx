import * as React from 'react';
import log from '@/libs/logger';
import CircularProgress from '@mui/material/CircularProgress';

export default async function RecipePage() {
  log().Debug(new Error(), 'loading');

  return <CircularProgress />;
}
