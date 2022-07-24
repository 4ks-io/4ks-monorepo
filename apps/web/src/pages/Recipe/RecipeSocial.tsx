import React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { stackItemStyles } from './styles';
import { useRecipeContext } from '../../providers/recipe-context';

interface RecipeSocialProps {}

export function RecipeSocial(props: RecipeSocialProps) {
  const rtx = useRecipeContext();

  return (
    <Stack.Item align="start" styles={stackItemStyles}>
      <span>Contributors</span>
      {rtx?.recipe?.contributors?.map((c) => {
        return (
          <Stack.Item key={c.id} align="center" styles={stackItemStyles}>
            <span>{c.displayName}</span>
          </Stack.Item>
        );
      })}
    </Stack.Item>
  );
}
