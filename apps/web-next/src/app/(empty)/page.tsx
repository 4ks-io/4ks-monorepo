import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import AppBarAvatarAuthenticated from '@/components/AppBarAvatarAuthenticated';
import AppBarAvatarUnauthenticated from '@/components/AppBarAvatarUnauthenticated';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Toolbar from '@mui/material/Toolbar';
import { models_User } from '@4ks/api-fetch';

export default async function DefaultPage() {
  const session = await getSession();
  const data =
    (session && (await serverClient.users.getAuthenticated())) ||
    ({} as models_User);
  console.log(data);

  // const apikey = `${process.env.NEXT_PUBLICTYPESENSE_API_KEY}`;
  // const host = `${process.env.NEXT_PUBLICTYPESENSE_URL}`;
  // const path = `${process.env.NEXT_PUBLICTYPESENSE_PATH}`;
  // console.log('DefaultPage', { apikey, host, path });

  return (
    <Box height="92vh" display="flex" flexDirection="column">
      <Toolbar sx={{ backgroundColor: 'background.paper' }}>
        <Box sx={{ flexGrow: 1 }} />
        {session ? (
          <AppBarAvatarAuthenticated username={`${data.username}`} />
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
          <Box
            component="img"
            sx={{ height: 96, paddingRight: 1 }}
            alt="4ks.io"
            src={'/logo.svg'}
          />
        </a>
        <TextField
          id="searchBox"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip label="Ctrl+K" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Box>
  );
}
