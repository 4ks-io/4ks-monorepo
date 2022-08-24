import {
  Stack,
  IStackProps,
  IStackStyles,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';
import { DefaultPalette } from '@fluentui/react';

export const stackStyles: IStackStyles = {
  root: {
    padding: '0px',
    // background: DefaultPalette.themeTertiary,
  },
};

export const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 5,
  padding: 10,
};

export const stackItemStyles: IStackItemStyles = {
  root: {
    // background: DefaultPalette.themePrimary,
    // color: DefaultPalette.white,
    padding: 2,
  },
};
