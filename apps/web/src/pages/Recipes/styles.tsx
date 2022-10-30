import {
  Stack,
  IStackProps,
  IStackStyles,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';
import { DefaultPalette } from '@fluentui/react';

export const stackTokens: IStackTokens = {
  childrenGap: 4,
};

const PLACEHOLDER_TAGS = ['vegan', 'beef', 'poultry', 'meat'];

export const stackStyles: IStackStyles = {
  root: {
    // background: DefaultPalette.themeTertiary,
  },
};

export const stackItemStyles: IStackItemStyles = {
  root: {
    // background: DefaultPalette.themePrimary,
    // color: DefaultPalette.white,
    padding: 5,
  },
};

export const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 5,
  padding: 10,
};
