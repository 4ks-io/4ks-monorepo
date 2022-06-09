import React from 'react';

import { AppShell, Button } from '@mantine/core';
import AppNavBar from './AppNavBar';
import { RecipeLayout } from '../recipe';
import { useSessionContext } from '../../providers/session-context';

interface IAppShellProps {
  toggleColorScheme: () => void;
}

export function AppLayout(props: IAppShellProps) {
  const sessionContext = useSessionContext();

  const handleTestAPI = async () => {
    // api.foo;
    // const u: models_User = {
    //   username: 'nic',
    // };
    // console.log(api);
    // console.log(Object.keys(api));
    // console.log(u);
    // api.users.postUsers(u);
    const r: any = {
      currentRevision: {
        author: {
          username: 'ndelorme',
          displayName: 'Nic',
        },
        images: [
          {
            id: 'string',
            url: 'string',
          },
        ],
        instructions: [
          {
            name: 'string',
            text: 'string',
            type: 'string',
          },
        ],
        name: 'Nics famous cookies',
      },
    };
    // console.log('start');
    // await RecipesService.postRecipes(r);
    // console.log('done');

    // api.recipes.RecipesServicepostRecipes(r);
    if (sessionContext?.api) {
      // console.log(api);
      // console.log(api.users);
      // // const u = new api.users();
      // // console.log(u);
      // api.users.postUsers({
      //   createdDate: 'string',
      //   displayName: 'string',
      //   emailAddress: 'string@email.com',
      //   id: 'string',
      //   updatedDate: 'string',
      //   username: 'string',
      // });
      let data = await sessionContext.api.recipes.postRecipes(r);
      console.log('set', data);
      data = await sessionContext.api.recipes.getRecipes(data.id);
      console.log('get', data);
    }

    try {
      // const existingUser = await api.profile.profileControllerGet();
      // setUserContext({ api, user: existingUser });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      header={<AppNavBar toggleColorScheme={props.toggleColorScheme} />}
    >
      <Button variant="subtle" onClick={handleTestAPI}>
        TEST API
      </Button>
      <RecipeLayout />
    </AppShell>
  );
}

export default AppLayout;
