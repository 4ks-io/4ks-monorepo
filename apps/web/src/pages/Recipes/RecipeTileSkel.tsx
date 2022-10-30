import React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import Skeleton from 'react-loading-skeleton';
import {
  stackStyles,
  stackTokens,
  stackItemStyles,
  itemAlignmentsStackTokens,
} from './styles';

const RecipeTileSkel = () => {
  return (
    <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
      <Stack.Item
        key={0}
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
        <Skeleton count={3} />
      </Stack.Item>
    </Stack>
  );
};

export default RecipeTileSkel;
