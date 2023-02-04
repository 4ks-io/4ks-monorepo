import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Stack } from '@fluentui/react/lib/Stack';
import { useAuth0 } from '@auth0/auth0-react';
import {
  CommandBar,
  ICommandBarItemProps,
  ICommandBarStyles,
} from '@fluentui/react/lib/CommandBar';
import { useRecipeContext } from '../../../providers';
import { useSessionContext } from '../../../providers';
import { models_UserSummary } from '@4ks/api-fetch';

export enum RecipeViews {
  Media = '/m',
  Forks = '/f',
  Comments = '/c',
  // Story = "/s",
  Versions = '/v',
  Settings = '/s',
}

const CommandBarStyles: ICommandBarStyles = {
  root: {
    padding: 0,
  },
};

export function RecipeControls() {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  const ctx = useSessionContext();
  const rtx = useRecipeContext();

  const [isRecipeContributor, setIsRecipeContributor] = useState(false);

  useEffect(() => {
    setIsRecipeContributor(
      (isAuthenticated &&
        rtx?.recipe.contributors
          ?.map((c: models_UserSummary) => c.id)
          .includes(ctx.user?.id)) ||
        false
    );
  }, [rtx, ctx.user]);

  const _items_base: ICommandBarItemProps[] = [
    {
      key: 'recipe',
      text: 'Recipe',
      iconProps: { iconName: 'LocationCircle' },
      onClick: () => {
        if (location.pathname != '/r/0') {
          navigate(`/r/${rtx?.recipeId}`);
        }
      },
    },
  ];

  const _items_more: ICommandBarItemProps[] = [
    {
      key: 'media',
      text: 'Media',
      iconProps: { iconName: 'PhotoCollection' },
      onClick: () => navigate(`/r/${rtx?.recipeId}` + RecipeViews.Media),
    },
    {
      key: 'forks',
      text: 'Forks',
      iconProps: { iconName: 'BranchFork' },
      onClick: () => navigate(`/r/${rtx?.recipeId}` + RecipeViews.Forks),
    },
    {
      key: 'versions',
      text: 'Versions',
      iconProps: { iconName: 'WebAppBuilderFragment' },
      onClick: () => navigate(`/r/${rtx?.recipeId}` + RecipeViews.Versions),
    },
  ];

  const _items_owner: ICommandBarItemProps[] = [
    {
      key: 'settings',
      text: 'Settings',
      iconProps: { iconName: 'Settings' },
      onClick: () => navigate(`/r/${rtx?.recipeId}` + RecipeViews.Settings),
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

  let items = _items_base;
  if (rtx?.recipeId && rtx?.recipeId != '0') {
    items = items.concat(_items_more);
  }
  if (rtx?.recipeId && rtx?.recipeId != '0' && isRecipeContributor) {
    items = items.concat(_items_owner);
  }

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
          items={items}
          ariaLabel="Page Navigation"
          primaryGroupAriaLabel="PageNavigation"
        />
      </div>
    </Stack.Item>
  );
}
