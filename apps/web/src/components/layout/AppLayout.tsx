import React from 'react';

import { AppShell } from '@mantine/core';
import AppNavBar from './AppNavBar';
import { RecipeLayout } from '../recipe';

interface IAppShellProps {
  toggleColorScheme: () => void;
}

export function AppLayout(props: IAppShellProps) {
  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      header={<AppNavBar toggleColorScheme={props.toggleColorScheme} />}
    >
      <RecipeLayout />
    </AppShell>
  );
}

export default AppLayout;
