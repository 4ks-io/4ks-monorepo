import React from 'react';
import Stack from '@mui/material/Stack';
import UpdateUsername from '@/components/UpdateUsername';
import { Page, PageProps } from '@/libs/navigation';
import { handleUserNavigation } from '@/libs/server/navigation';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '4ks Settings',
  description: '4ks User Settings',
};

export default async function SettingsPage({
  params,
  searchParams,
}: PageProps) {
  const { user } = await handleUserNavigation(Page.AUTHENTICATED);

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
          <Typography variant="body1" component="h2">
            <ul>
              <li>Username must be minimum 8 and maximum 24 characters.</li>
              <li>
                It may only contain alphanumeric characters or non-consecutive
                hyphens.
              </li>
              <li>It cannot begin or end with a hyphen.</li>
              <li>
                It cannot be a{' '}
                <Link href="/reserved-words" passHref>
                  reserved words
                </Link>
                .
              </li>
            </ul>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
