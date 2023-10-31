import * as React from 'react';
import Box from '@mui/material/Box';
import { getSession } from '@auth0/nextjs-auth0';
import AppBarUnauthenticated from '@/components/AppBarUnauthenticated';
import AppBarAuthenticated from '@/components/AppBarAuthenticated';
export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <>
      {session ? <AppBarAuthenticated /> : <AppBarUnauthenticated />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          mt: ['12px', '18px', '24px'],
          p: 3,
        }}
      >
        <>Bearer {session?.accessToken}</>
        {children}
      </Box>
    </>
  );
}
