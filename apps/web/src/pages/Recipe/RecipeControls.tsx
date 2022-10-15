import React from 'react';
import { Label } from '@fluentui/react/lib/Label';
import { Stack, IStackStyles } from '@fluentui/react/lib/Stack';
import {
  CommandBar,
  ICommandBarItemProps,
  ICommandBarStyles,
} from '@fluentui/react/lib/CommandBar';
import { FocusTrapZone } from '@fluentui/react/lib/FocusTrapZone';
import { setVirtualParent } from '@fluentui/dom-utilities';
import { IButtonProps } from '@fluentui/react/lib/Button';

export enum RecipeViews {
  RecipeContent,
  Forks,
  Comments,
  Story,
}

interface RecipeControlsProps {
  setSelectedView: (view: RecipeViews) => void;
}

const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

const CommandBarStyles: ICommandBarStyles = {
  root: {
    padding: 0,
  },
};

export function RecipeControls({ setSelectedView }: RecipeControlsProps) {
  const _items: ICommandBarItemProps[] = [
    {
      key: 'recipe',
      text: 'Recipe',
      iconProps: { iconName: 'LocationCircle' },
      onClick: () => setSelectedView(RecipeViews.RecipeContent),
    },
    {
      key: 'forks',
      text: 'Fork',
      iconProps: { iconName: 'BranchFork' },
      onClick: () => setSelectedView(RecipeViews.Forks),
    },
    {
      key: 'comments',
      text: 'Comments',
      iconProps: { iconName: 'Message' },
      onClick: () => setSelectedView(RecipeViews.Comments),
    },
    {
      key: 'story',
      text: 'Story',
      iconProps: { iconName: 'SingleBookmark' },
      onClick: () => setSelectedView(RecipeViews.Story),
    },
  ];

  return (
    <Stack.Item align="stretch" style={{ paddingTop: '24px' }}>
      <div
        style={{
          borderBottom: '1px solid black',
          paddingBottom: '5px',
        }}
      >
        <CommandBar
          styles={CommandBarStyles}
          items={_items}
          ariaLabel="Inbox actions"
          primaryGroupAriaLabel="PageNavigation"
        />
      </div>
    </Stack.Item>
  );
}
