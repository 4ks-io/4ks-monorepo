import React from 'react';
import { Label } from '@fluentui/react/lib/Label';
import { Stack, IStackStyles } from '@fluentui/react/lib/Stack';

interface RecipeControlsProps {}

export function RecipeControls({}: RecipeControlsProps) {
  const stackStyles: IStackStyles = {
    root: {
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 4,
      borderBottom: '1px solid rgb(200, 200, 200)',
    },
  };
  const selectedTabStyle = {
    borderBottom: '1px solid black',
    paddingBottom: '5px',
  };

  return (
    <Stack.Item align="stretch">
      <Stack horizontal horizontalAlign="space-between" styles={stackStyles}>
        <Label style={selectedTabStyle}>Recipe</Label>
        <Label>Forks</Label>
        <Label>Story</Label>
        <Label>Comments</Label>
      </Stack>
    </Stack.Item>
  );
}
