import * as React from 'react';
import Box from '@mui/material/Box';
import { headers } from 'next/headers';

export default async function SettingsPage() {
  const headersList = headers();
  const pathname = headersList.get('x-url-pathname') || '';
  // const orgName = pathname.split("/")[1];

  return (
    <Box sx={{ display: 'flex' }}>
      Settings Page
      <div>{pathname}</div>
    </Box>
  );
}
