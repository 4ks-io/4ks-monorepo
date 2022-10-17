import React, { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { useAuth0 } from '@auth0/auth0-react';
import {
  CommandBar,
  ICommandBarItemProps,
  ICommandBarStyles,
} from '@fluentui/react/lib/CommandBar';
import { useRecipeContext } from '../../providers/recipe-context';
import { useSessionContext } from '../../providers/session-context';

export enum RecipeViews {
  RecipeContent,
  Forks,
  Comments,
  Story,
  Versions,
  Settings,
}

interface RecipeControlsProps {
  setSelectedView: (view: RecipeViews) => void;
}

const CommandBarStyles: ICommandBarStyles = {
  root: {
    padding: 0,
  },
};

export function RecipeControls({ setSelectedView }: RecipeControlsProps) {
  const { isAuthenticated } = useAuth0();
  const ctx = useSessionContext();
  const rtx = useRecipeContext();

  const [isRecipeContributor, setIsRecipeContributor] = useState(false);

  useEffect(() => {
    setIsRecipeContributor(
      (isAuthenticated &&
        rtx?.recipe.contributors?.map((c) => c.id).includes(ctx.user?.id)) ||
        false
    );
  }, [rtx, ctx.user]);

  const _items_base: ICommandBarItemProps[] = [
    {
      key: 'recipe',
      text: 'Recipe',
      iconProps: { iconName: 'LocationCircle' },
      onClick: () => setSelectedView(RecipeViews.RecipeContent),
    },
    {
      key: 'forks',
      text: 'Forks',
      iconProps: { iconName: 'BranchFork' },
      onClick: () => setSelectedView(RecipeViews.Forks),
    },
    {
      key: 'versions',
      text: 'Versions',
      iconProps: { iconName: 'WebAppBuilderFragment' },
      onClick: () => setSelectedView(RecipeViews.Versions),
    },
  ];
  const _items_owner: ICommandBarItemProps[] = [
    {
      key: 'settings',
      text: 'Settings',
      iconProps: { iconName: 'Settings' },
      onClick: () => setSelectedView(RecipeViews.Settings),
    },
  ];
  // const _items_disabled: ICommandBarItemProps[] = [
  //   {
  //     key: 'comments',
  //     text: 'Comments',
  //     iconProps: { iconName: 'Message' },
  //     onClick: () => setSelectedView(RecipeViews.Comments),
  //   },
  //   {
  //     key: 'story',
  //     text: 'Story',
  //     iconProps: { iconName: 'SingleBookmark' },
  //     onClick: () => setSelectedView(RecipeViews.Story),
  //   },
  // ];

  return (
    <Stack.Item align="stretch" style={{ paddingTop: '24px' }}>
      <div
        style={{
          borderBottom: '1px solid gray',
          paddingBottom: '5px',
        }}
      >
        <CommandBar
          styles={CommandBarStyles}
          items={
            rtx?.recipeId && rtx?.recipeId != '0' && isRecipeContributor
              ? _items_base.concat(_items_owner)
              : _items_base
          }
          ariaLabel="Page Navigation"
          primaryGroupAriaLabel="PageNavigation"
        />
      </div>
    </Stack.Item>
  );
}
