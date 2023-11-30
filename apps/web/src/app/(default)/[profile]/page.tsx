import * as React from 'react';
import Box from '@mui/material/Box';
import { serverClient } from '@/trpc/serverClient';
import { Page, PageProps } from '@/libs/navigation';
import { handleUserNavigation } from '@/libs/server/navigation';
import { dtos_GetRecipesByUsernameResponse } from '@4ks/api-fetch';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { TRPCError } from '@trpc/server';
import { notFound } from 'next/navigation';
import log from '@/libs/logger';
import SearchResults from '@/components/SearchResults';
import Container from '@mui/material/Container';

export type ProfilePropsParams = { profile: string };

export default async function ProfilePage({ params, searchParams }: PageProps) {
  const { user } = await handleUserNavigation(Page.AUTHENTICATED);
  const username = (params as unknown as ProfilePropsParams).profile;

  const data =
    (await serverClient.search.recipesByAuthor(username)) ?? undefined;

  // fetch
  // let r = {} as dtos_GetRecipesByUsernameResponse;
  // try {
  //   r = (await serverClient.recipes.getAllByAuthor(username)) ?? {};
  // } catch (e) {
  //   if (e instanceof TRPCError && getHTTPStatusCodeFromError(e) === 404) {
  //     log().Error(new Error(), [
  //       { k: 'msg', v: 'ProfilePage: failed to fetch recipes' },
  //     ]);
  //     return notFound();
  //   }
  // }

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
      <Container>
        <h2>@{username}</h2>
        <h3>Recipes</h3>
        {<SearchResults results={data} />}
      </Container>
    </Box>
  );
}
