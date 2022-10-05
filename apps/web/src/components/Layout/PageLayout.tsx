import React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';

import AppBar from './AppBar';

interface PageProps {}

const PageLayout = (props: React.PropsWithChildren<PageProps>) => {
  return (
    <Stack verticalAlign="space-between">
      <AppBar />
      {props?.children}
    </Stack>
  );
};

export default PageLayout;
