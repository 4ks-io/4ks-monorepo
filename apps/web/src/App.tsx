import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import AppLayout from './components/layout/AppLayout';
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from '@mantine/core';
import ApiServiceFactory from './services';
import { models_Recipe } from '@4ks/api-fetch';

export const themeHotKey = 'mod+J';

function App() {
  const DARK = 'dark';
  const LIGHT = 'light';

  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: LIGHT,
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    if (user) {
      getAccessTokenSilently().then(async (t) => {
        const api = ApiServiceFactory(t);
        // const r: models_Recipe = {
        //   createdDate: 'string',
        //   currentRevision: {
        //     author: {
        //       displayName: 'string',
        //       id: 'string',
        //       username: 'string',
        //     },
        //     createdDate: 'string',
        //     id: 'string',
        //     images: [
        //       {
        //         id: 'string',
        //         url: 'string',
        //       },
        //     ],
        //     instructions: [
        //       {
        //         name: 'string',
        //         text: 'string',
        //         type: 'string',
        //       },
        //     ],
        //     name: 'string',
        //     recipeId: 'string',
        //     updatedDate: 'string',
        //   },
        //   id: 'string',
        //   metadata: {
        //     forks: 0,
        //     stars: 0,
        //   },
        //   source: 'string',
        //   updatedDate: 'string',
        // };
        // api.recipes.postRecipes([r]);
        try {
          // const existingUser = await api.profile.profileControllerGet();
          // setUserContext({ api, user: existingUser });
        } catch (error) {
          console.error(error);
        }
      });
    }
  }, [user]);

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
        <AppLayout toggleColorScheme={toggleColorScheme} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
