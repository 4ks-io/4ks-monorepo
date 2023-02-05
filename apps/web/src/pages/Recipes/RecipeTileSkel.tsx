import React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import Skeleton from 'react-loading-skeleton';
import {
  stackStyles,
  stackTokens,
  stackItemStyles,
  itemAlignmentsStackTokens,
} from './styles';

interface RecipeTileSkelProps {
  id: number;
}
const RecipeTileSkel = ({ id }: RecipeTileSkelProps) => {
  return (
    <Stack
      styles={stackStyles}
      tokens={itemAlignmentsStackTokens}
      key={'RecipeTileSkel_' + id}
    >
      <Stack.Item
        style={{
          borderWidth: 0,
          borderStyle: 'solid',
          borderColor: 'gray',
          padding: 8,
        }}
      >
        <Stack styles={stackStyles} tokens={stackTokens}>
          <Stack horizontal>
            <Stack.Item align="auto" styles={stackItemStyles}>
              <span>
                <Skeleton />
              </span>
            </Stack.Item>
          </Stack>
        </Stack>
        <Skeleton count={2} />
        <Skeleton height={160} />
      </Stack.Item>
    </Stack>
  );
};

export default RecipeTileSkel;
