import * as React from 'react';
import Box from '@mui/material/Box';
import { headers } from 'next/headers';
import { serverClient } from '@/trpc/serverClient';
import { models_Recipe } from '@4ks/api-fetch';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { notFound } from 'next/navigation';

export default async function RecipePage() {
  const headersList = headers();
  const pathname = headersList.get('x-url-pathname') || '';
  const recipeID = pathname.split('/').slice(-1)[0];

  // fetch
  let data = {} as models_Recipe;
  try {
    data = (await serverClient.recipes.getByID(recipeID)) ?? {};
  } catch (e) {
    if (e instanceof TRPCError && getHTTPStatusCodeFromError(e) === 404) {
      return notFound();
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <div>
        <div>{JSON.stringify(data)}</div>
      </div>
    </Box>
  );
}
