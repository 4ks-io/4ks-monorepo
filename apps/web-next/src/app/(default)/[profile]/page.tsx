import * as React from 'react';
import Box from '@mui/material/Box';
import { headers } from 'next/headers';
import { serverClient } from '@/trpc/serverClient';
import { dtos_GetRecipesByUsernameResponse } from '@4ks/api-fetch';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { TRPCError } from '@trpc/server';
import { notFound } from 'next/navigation';
import { getSession } from '@auth0/nextjs-auth0';
import log from '@/libs/logger';
import { normalizeForURL } from '@/libs/navigation';

export default async function ProfilePage() {
  const session = await getSession();

  const headersList = headers();
  const pathname = headersList.get('x-url-pathname') || '';
  const username = pathname.split('/')[1];

  // fetch
  let r = {} as dtos_GetRecipesByUsernameResponse;
  try {
    r = (await serverClient.recipes.getAllByAuthor(username)) ?? {};
  } catch (e) {
    if (e instanceof TRPCError && getHTTPStatusCodeFromError(e) === 404) {
      log().Error(new Error(), 'ProfilePage: failed to fetch recipes');
      return notFound();
    }
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        mt: ['12px', '18px', '24px'],
        p: 3,
      }}
    >
      <div>
        <h2>@{username}</h2>
        <br />
        <h3>Recipes</h3>
        <br />
        <ul>
          {r?.data?.map(({ id, currentRevision }) => {
            return (
              <li key={id}>
                <a
                  href={`/recipe/${id}-${normalizeForURL(
                    currentRevision?.name
                  )}`}
                >
                  {currentRevision?.name || id}
                </a>
              </li>
            );
          })}
        </ul>
        <div>Bearer {session?.accessToken}</div>
      </div>
    </Box>
  );
}
