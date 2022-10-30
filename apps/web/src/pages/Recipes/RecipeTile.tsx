import React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { models_Recipe } from '@4ks/api-fetch';
import { Text } from '@fluentui/react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { stackStyles, stackTokens, stackItemStyles } from './styles';

const PLACEHOLDER_TAGS = ['vegan', 'beef', 'poultry', 'meat'];

interface RecipeTileProps {
  recipe: models_Recipe;
}
const RecipeTile = ({ recipe }: RecipeTileProps) => {
  return (
    <Stack.Item
      key={recipe.id}
      style={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'gray',
        padding: 8,
      }}
    >
      <Stack styles={stackStyles} tokens={stackTokens}>
        <Stack horizontal>
          <Stack.Item align="auto" styles={stackItemStyles}>
            <span>
              <Link to={`/r/${recipe.id}`}>
                <Text variant="xLarge" style={{ fontWeight: 'bold' }}>
                  {recipe.currentRevision?.name || `missing title`}
                </Text>
              </Link>
            </span>
          </Stack.Item>
        </Stack>
        <Stack
          horizontal
          tokens={{
            childrenGap: 4,
          }}
        >
          {PLACEHOLDER_TAGS.map((tag) => {
            return (
              <Stack.Item key={`${recipe.id}_${tag}`}>
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  #{tag}
                </Text>
              </Stack.Item>
            );
          })}
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 4 }}>
          <Stack.Item>Chefs:</Stack.Item>
          {recipe.contributors?.map((contributor, idx) => (
            <Stack.Item
              style={{ fontWeight: 'bold' }}
              key={`${recipe.id}_${contributor}`}
            >
              {contributor.username}
              {idx < (recipe.contributors?.length || 0) - 1 ? ',' : ''}
            </Stack.Item>
          ))}
        </Stack>
      </Stack>
    </Stack.Item>
  );
};

export default RecipeTile;
