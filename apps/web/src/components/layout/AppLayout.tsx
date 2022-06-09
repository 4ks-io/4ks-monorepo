import React from 'react';

import { AppShell, Button } from '@mantine/core';
import AppNavBar from './AppNavBar';
import { RecipeLayout } from '../recipe';
import { useSessionContext } from '../../providers/session-context';

interface IAppShellProps {
  toggleColorScheme: () => void;
}

export function AppLayout(props: IAppShellProps) {
  const ctx = useSessionContext();

  const handleTestAPIRecipe = async () => {
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

    if (ctx?.api) {
      let data = await ctx.api.recipes.postRecipes(r);
      console.log('set', data);
      data = await ctx.api.recipes.getRecipes(data.id);
      console.log('get', data);
    }
  };

  const handleTestAPIUser = async () => {
    if (ctx?.api && ctx?.user) {
      console.log(ctx.user);
      // // const u = new api.users();
      // // console.log(u);
      const u = {
        displayName: ctx.user.nickname,
        emailAddress: ctx.user.email,
        username: ctx.user.email,
      };

      try {
        let data = await ctx.api.users.postUsers(u);
        console.log('set', data);
      } catch (error) {
        console.error(error);
      }
      try {
        let data2 = await ctx.api.users.getUsers(ctx.user.email);
        console.log('get', data2);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      header={<AppNavBar toggleColorScheme={props.toggleColorScheme} />}
    >
      <Button variant="subtle" onClick={handleTestAPIUser}>
        TEST User
      </Button>
      <Button variant="subtle" onClick={handleTestAPIRecipe}>
        TEST Recipe
      </Button>
      <RecipeLayout />
    </AppShell>
  );
}

export default AppLayout;
