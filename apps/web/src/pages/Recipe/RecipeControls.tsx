import React from 'react';
import { Label } from '@fluentui/react/lib/Label';
import {
  Stack,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';

import { stackStyles } from './styles';
interface RecipeControlsProps {}

export function RecipeControls({}: RecipeControlsProps) {
  const customSpacingStackTokens: IStackTokens = {
    childrenGap: '20%',
    padding: 's1 15%',
  };
  const selectedTabStyle = {
    borderBottom: '1px solid black',
    paddingBottom: '5px',
  };

  const stackItemStyles: IStackItemStyles = {
    root: {
      paddingLeft: 10,
    },
  };

  return (
    <Stack.Item align="start" styles={stackItemStyles}>
      <Stack horizontal styles={stackStyles} tokens={customSpacingStackTokens}>
        <Label style={selectedTabStyle}>Recipe</Label>
        <Label>Forks</Label>
        <Label>Story</Label>
        <Label>Comments</Label>
      </Stack>
    </Stack.Item>
  );
}
