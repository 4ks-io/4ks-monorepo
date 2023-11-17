'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export default function AppHeaderAvatarUnauthenticated() {
  const router = useRouter();

  return <Button onClick={() => router.push('/app/auth/login')}>Login</Button>;
}
