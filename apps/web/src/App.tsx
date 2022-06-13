import React from 'react';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from '@mantine/core';

import AppLayout from './components/layout/AppLayout';
import { SessionContextProvider } from './providers/session-context';
import Router from './Router';

export const themeHotKey = 'mod+J';

function App() {
  const DARK = 'dark';
  const LIGHT = 'light';

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: LIGHT,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === DARK ? LIGHT : DARK));

  useHotkeys([[themeHotKey, () => toggleColorScheme()]]);

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
        <SessionContextProvider>
          <Router />
        </SessionContextProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
