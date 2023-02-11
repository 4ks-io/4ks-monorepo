import React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { stackItemStyles } from './../../styles';
import { useRecipeContext } from '../../../../providers';
import { SectionTitle } from '../components';

interface RecipeSocialProps {}

export function RecipeSocial(props: RecipeSocialProps) {
  const rtx = useRecipeContext();

  return (
    <>
      <Stack.Item align="start" styles={stackItemStyles}>
        <SectionTitle value={'Contributors'} />
        {rtx?.recipe?.contributors?.map((c) => {
          return (
            <Stack.Item key={c.id} align="center" styles={stackItemStyles}>
              <span>{c.username}</span>
            </Stack.Item>
          );
        })}
      </Stack.Item>
      <Stack.Item align="start" styles={stackItemStyles}>
        {rtx?.recipe.currentRevision?.link && (
          <>
            <SectionTitle value={'Source'} />
            <a
              href={'https://' + rtx.recipe.currentRevision?.link}
              target="_blank"
              rel="noreferrer"
            >
              {rtx.recipe.currentRevision?.link.split('/')[0]}
            </a>
          </>
        )}
      </Stack.Item>
    </>
  );
}
