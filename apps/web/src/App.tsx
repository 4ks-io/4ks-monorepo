import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
// import './App.css';
// import Test from './components/Test';
import { Settings } from 'tabler-icons-react';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

import {
  AppShell,
  Avatar,
  ActionIcon,
  Navbar,
  Header,
  Image,
  Space,
  Grid,
  TextInput,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from '@mantine/core';

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AppShell
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          fixed
          header={
            <Header height={64} p="md">
              <Grid justify="space-between" columns={24}>
                <Grid.Col span={1}>
                  <div style={{ width: 36 }}>
                    <Image src={logo} alt="logo" />
                  </div>
                  {/* <TextInput
                    placeholder="Your name"
                    label="Full name"
                    required
                  /> */}
                </Grid.Col>
                <Grid.Col span={1} offset={22}>
                  <ActionIcon
                    variant="light"
                    onClick={() => toggleColorScheme()}
                  >
                    <Settings size={16} />
                  </ActionIcon>

                  <Avatar radius="xl" />
                </Grid.Col>
              </Grid>
            </Header>
          }
        >
          <Text>Resize app to see responsive navbar in action</Text>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
