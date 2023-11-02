import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import { models_User } from '@4ks/api-fetch';
import { SearchContextProvider } from '@/providers/search-context';
import LandingPageSearchBox from '@/components/LandingPageSearchBox';
import AppBarAvatarAuthenticated from '@/components/AppBarAvatarAuthenticated';
import AppBarAvatarUnauthenticated from '@/components/AppBarAvatarUnauthenticated';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

export default async function DefaultPage() {
  const session = await getSession();
  const user =
    (session && (await serverClient.users.getAuthenticated())) ?? undefined;

  return (
    <Box height="92vh" display="flex" flexDirection="column">
      <Toolbar sx={{ backgroundColor: 'background.paper' }}>
        <Box sx={{ flexGrow: 1 }} />
        {session && user ? (
          <AppBarAvatarAuthenticated username={`${user.username}`} />
        ) : (
          <AppBarAvatarUnauthenticated />
        )}
      </Toolbar>

      <Stack
        height={'100%'}
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <a href="/explore">
          <Tooltip title="Explore">
            <Box
              component="img"
              sx={{ height: 96, paddingRight: 1 }}
              alt="4ks.io"
              src={'/logo.svg'}
            />
          </Tooltip>
        </a>
        <SearchContextProvider>
          <LandingPageSearchBox />
        </SearchContextProvider>
      </Stack>
    </Box>
  );
}
