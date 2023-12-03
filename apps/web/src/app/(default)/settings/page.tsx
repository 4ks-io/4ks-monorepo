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
import Stack from '@mui/material/Stack';
import UsernameSpecification from '@/components/UsernameSpecifications';
import DeveloperTools from '@/components/DeveloperTools';
import AppHeader from '@/components/AppHeader';

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

  if (!session || !session?.user || !user || !user?.username) {
    return <div>Error</div>;
  }

  return (
    <>
      <AppHeader user={user} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          // mt: ['12px', '18px', '24px'],
          p: 3,
        }}
      >
        <Container maxWidth="sm" style={{ paddingTop: 40 }}>
          <Typography variant="h4" component="h2">
            Settings
          </Typography>
          <Stack spacing={2} style={{ paddingTop: 40 }}>
            <Typography variant="subtitle1" component="h2">
              Email: {user.emailAddress}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              Current Username: {user.username}
            </Typography>

            <UpdateUsername username={user.username} />
            <UsernameSpecification />
          </Stack>
        </Container>
      </Box>
      {session?.accessToken && <DeveloperTools t={session.accessToken} />}
    </>
  );
}
