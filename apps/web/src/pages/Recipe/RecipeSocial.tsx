import React, { useState } from 'react';
import {
  Stack,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { models_UserSummary } from '@4ks/api-fetch';
import { Label } from '@fluentui/react/lib/Label';
import {
  stackStyles,
  stackItemStyles,
  itemAlignmentsStackTokens,
} from './styles';
import { DefaultPalette } from '@fluentui/react';

interface RecipeSocialProps {
  data: models_UserSummary[] | undefined;
}

export function RecipeSocial({ data }: RecipeSocialProps) {
  return (
    <Stack.Item align="start" styles={stackItemStyles}>
      <span>Contributors</span>
      {data?.map((c) => {
        return (
          <Stack.Item key={c.id} align="center" styles={stackItemStyles}>
            <span>{c.displayName}</span>
          </Stack.Item>
        );
      })}
    </Stack.Item>
  );
}
