'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import { Theme, useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

const AppBarButtonStyles = (theme: Theme) => {
  return {
    my: 2,
    color: theme.palette.primary.dark,
    display: 'block',
  };
};

export default function AppBarAvatarUnauthenticated() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Button
      sx={AppBarButtonStyles(theme)}
      onClick={() => router.push('/app/auth/login')}
    >
      Login
    </Button>
  );
}
