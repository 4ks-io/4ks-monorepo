import React, { useEffect } from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { useLocation } from 'react-router-dom';

import AppBar from './AppBar';

interface PageProps {}

const PageLayout = (props: React.PropsWithChildren<PageProps>) => {
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('locationPathname', location.pathname);
  }, [location.pathname]);

  return (
    <Stack verticalAlign="space-between">
      <AppBar />
      {props?.children}
    </Stack>
  );
};

export default PageLayout;
