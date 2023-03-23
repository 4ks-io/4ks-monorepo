import React from 'react';
import { Label } from '@fluentui/react/lib/Label';
import {
  Stack,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';
import { DefaultPalette } from '@fluentui/react';
import { formatDate } from '../../../../utils/dateTime';
import { useRecipeContext } from '../../../../providers';
import { Icon } from '@fluentui/react/lib/Icon';

interface RecipeSummaryProps {}

const RecipeTags = () => {
  const wrapStackTokens: IStackTokens = { childrenGap: 30 };

  return (
    <Stack horizontal wrap tokens={wrapStackTokens}>
      <div style={{ paddingLeft: 4 }}>
        <Label>#vegan</Label>
        <Label>#beef</Label>
        <Label>#poutry</Label>
        <Label>#meat</Label>
        <Label>
          <Icon
            iconName="Add"
            onClick={() => {
              console.log('add some tag');
            }}
          />
        </Label>
      </div>
    </Stack>
  );
};

export function RecipeSummary(props: RecipeSummaryProps) {
  const rtx = useRecipeContext();

  const stackItemStyles: IStackItemStyles = {
    root: {
      // background: DefaultPalette.themePrimary,
      // color: DefaultPalette.white,
      padding: 5,
    },
  };

  const stackTokens: IStackTokens = {
    childrenGap: 1,
    padding: 10,
  };

  const spanStyle = {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid rgb(200, 200, 200)',
    background: DefaultPalette.themePrimary,
    color: DefaultPalette.white,
  };

  return (
    <Stack.Item align="stretch" styles={stackItemStyles}>
      <RecipeTags />
      <Stack horizontal tokens={stackTokens}>
        <Stack.Item grow styles={stackItemStyles}>
          <span style={spanStyle}>prep time: 10 mins</span>
        </Stack.Item>
        <Stack.Item grow styles={stackItemStyles}>
          <span style={spanStyle}>cook time: 8 mins</span>
        </Stack.Item>
        <Stack.Item grow styles={stackItemStyles}>
          <span style={spanStyle}>total time: 30 mins</span>
        </Stack.Item>
      </Stack>
      <Stack horizontal tokens={stackTokens}>
        <Stack.Item grow styles={stackItemStyles}>
          <span style={spanStyle}>servings: 36 cookies</span>
        </Stack.Item>
        <Stack.Item grow styles={stackItemStyles}>
          <span style={spanStyle}>calories: 180 kcal</span>
        </Stack.Item>
        <Stack.Item grow styles={stackItemStyles}>
          <span style={spanStyle}>
            last update:{' '}
            {rtx?.recipe?.updatedDate && formatDate(rtx.recipe.updatedDate)}
          </span>
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
}
