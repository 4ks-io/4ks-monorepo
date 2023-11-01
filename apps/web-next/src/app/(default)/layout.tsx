import * as React from 'react';
import { serverClient } from '@/trpc/serverClient';
import AppBar from '@/components/AppBar';
import Box from '@mui/material/Box';

type DefaultLayoutProps = {
  children: React.ReactNode;
};
export default async function DefaultLayout({ children }: DefaultLayoutProps) {
  const user = (await serverClient.users.getAuthenticated()) || undefined;

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
        {children}
      </Box>
    </>
  );
}
