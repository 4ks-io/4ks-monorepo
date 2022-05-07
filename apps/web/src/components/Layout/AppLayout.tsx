import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
// import './App.css';
// import Test from './components/Test';
import { Settings } from 'tabler-icons-react';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

import { AppShell, Text } from '@mantine/core';
import AppNavBar from './AppNavBar';

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
      <Text>Resize app to see responsive navbar in action</Text>
    </AppShell>
  );
  //
}

export default AppLayout;
