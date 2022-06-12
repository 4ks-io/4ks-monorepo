import React from 'react';

import { AppShell, Button } from '@mantine/core';
import AppNavBar from './AppNavBar';
import { RecipeLayout } from '../recipe';
import { useSessionContext } from '../../providers/session-context';
import { dtos_CreateRecipe, dtos_CreateUser } from '@4ks/api-fetch';

interface IAppShellProps {
  toggleColorScheme: () => void;
}

export function AppLayout(props: IAppShellProps) {
  const ctx = useSessionContext();

  const handleTestAPIRecipe = async () => {
    const createRecipe: dtos_CreateRecipe = {
        instructions: [
          {
            name: 'Mix dry ingredients',
            text: 'Mix flour and sugar together',
            type: 'HowToStep',
          },
        ],
        name: 'Nics famous cookies',
    }

    if (ctx?.api) {
      let data = await ctx.api.recipes.postRecipes(createRecipe);
      
      if (data.id) {
        data = await ctx.api.recipes.getRecipes(data.id);
      }
      
      console.log('get', data);
    }
  };

  const handleTestAPIUser = async () => {
    if (ctx?.api && ctx?.user) {
      console.log(ctx.user);

      if(!ctx.user.nickname || !ctx.user.email) {
        console.log("User information not available in context")
        return;
      }

      const u: dtos_CreateUser = {
        displayName: ctx.user.name || ctx.user.nickname,
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
