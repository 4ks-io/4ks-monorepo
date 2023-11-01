import * as React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import AppBar from '@/components/AppBar';
import Box from '@mui/material/Box';

type DefaultLayoutProps = {
  children: React.ReactNode;
};
export default async function DefaultLayout({ children }: DefaultLayoutProps) {
  const session = await getSession();
  const user =
    (session && (await serverClient.users.getAuthenticated())) || undefined;

  return (
    <>
      <AppBar user={user} />
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
