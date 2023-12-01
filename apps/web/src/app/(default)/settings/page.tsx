import React from 'react';
import Link from 'next/link';
import { getSession } from '@auth0/nextjs-auth0';
import UpdateUsername from '@/components/UpdateUsername';
import { Page, PageProps } from '@/libs/navigation';
import { handleUserNavigation } from '@/libs/server/navigation';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import UsernameSpecification from '@/components/UsernameSpecifications';

export const metadata: Metadata = {
  title: '4ks Settings',
  description: '4ks User Settings',
};

export default async function SettingsPage({
  params,
  searchParams,
}: PageProps) {
  const { user } = await handleUserNavigation(Page.AUTHENTICATED);
  const session = await getSession();

  if (!user || !user.username) {
    return (
      <Container maxWidth="sm" style={{ paddingTop: 40 }}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
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
      <Container maxWidth="sm" style={{ paddingTop: 40 }}>
        {/* <div>EVENTS: {JSON.stringify(user.events)}</div>
        <br />
        <div>TOKEN: Bearer {session?.accessToken}</div> */}
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

          <UpdateUsername username={user.username} />
          {UsernameSpecification()}
        </Stack>
      </Container>
    </Box>
  );
}
