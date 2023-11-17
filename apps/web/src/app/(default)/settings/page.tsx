import React, { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import UpdateUsername from '@/components/UpdateUsername';
import { Page, PageProps, PagePropsParams } from '@/libs/navigation';
import { handleUserNavigation } from '@/libs/server/navigation';
import { models_User } from '@4ks/api-fetch';
import log from '@/libs/logger';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';

export const metadata: Metadata = {
  title: '4ks Settings',
  description: '4ks User Settings',
};

// type registerRedirectRespone = {
//   user: models_User | undefined;
// };

// async function registerRedirect(
//   params: PagePropsParams
// ): Promise<registerRedirectRespone> {
//   console.log(params);
//   const session = await getSession();
//   if (!session) {
//     redirect('/app/auth/login');
//   }

//   const user =
//     (session && (await serverClient.users.getAuthenticated())) ?? undefined;

//   return { user };
// }

export default async function SettingsPage({
  params,
  searchParams,
}: PageProps) {
  const { user } = await handleUserNavigation(Page.AUTHENTICATED);

  // const session = await getSession();
  // const user =
  //   (session && (await serverClient.users.getAuthenticated())) ?? undefined;

  // // anonymous users have no business here
  // if (!session) {
  //   redirect('/app/auth/login');
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
      <Container maxWidth="sm" style={{ paddingTop: 40 }}>
        <Typography variant="h4" component="h2">
          Settings
        </Typography>
        <Stack spacing={2} style={{ paddingTop: 40 }}>
          <Typography variant="subtitle1" component="h2">
            Email: {user?.emailAddress}
          </Typography>
          <Typography variant="subtitle1" component="h2">
            Current Username: {user?.username}
          </Typography>

          <UpdateUsername />
          <Typography variant="body1" component="h2">
            <ul>
              <li>Username must be minimum 8 and maximum 24 characters.</li>
              <li>
                It may only contain alphanumeric characters or non-consecutive
                hyphens.
              </li>
              <li>It cannot begin or end with a hyphen.</li>
              <li>It cannot be a reserved word.</li>
            </ul>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
