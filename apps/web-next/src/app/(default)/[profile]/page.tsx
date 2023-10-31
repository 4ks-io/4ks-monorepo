import * as React from 'react';
import Box from '@mui/material/Box';
import { headers } from 'next/headers';
import { serverClient } from '@/trpc/serverClient';
import { dtos_GetRecipesByUsername } from '@4ks/api-fetch';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { TRPCError } from '@trpc/server';
import { notFound } from 'next/navigation';

export default async function ProfilePage() {
  const headersList = headers();
  const pathname = headersList.get('x-url-pathname') || '';
  const username = pathname.split('/')[1];

  // fetch
  let d = {} as dtos_GetRecipesByUsername;
  try {
    d = (await serverClient.recipes.getAllByAuthor(username)) ?? {};
  } catch (e) {
    console.log('client error client error client error');
    if (e instanceof TRPCError && getHTTPStatusCodeFromError(e) === 404) {
      return notFound();
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <div>
        <h2>@{username}</h2>
        <br />
        <h3>Recipes</h3>
        <br />
        <ul>
          {d?.data?.map((r) => {
            return (
              <li key={r.id}>
                <a href={`r/${r.id}`}>{r.currentRevision?.name || r.id}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </Box>
  );
}
