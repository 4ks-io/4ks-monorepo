import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import {
  Stack,
  IStackStyles,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';
import { DefaultButton } from '@fluentui/react/lib/Button';
// import { useNavigate, Link } from 'react-router-dom';

import { useSessionContext } from '../../providers/session-context';
import { models_Recipe } from '@4ks/api-fetch';
import { Text } from '@fluentui/react';

const stackTokens: IStackTokens = {
  childrenGap: 4,
};

const PLACEHOLDER_TAGS = ['vegan', 'beef', 'poultry', 'meat'];

export const documentProps = {
  title: '4ks',
  description: 'All Recipes',
};

export function Page() {
  const ctx = useSessionContext();
  const { isAuthenticated } = useAuth0();
  // const navigate = useNavigate();
  const [recipes, setRecipes] = useState<models_Recipe[] | undefined>();

  useEffect(() => {
    ctx.api?.recipes.getRecipes().then((r: models_Recipe[]) => {
      console.log(r);
      setRecipes(r);
    });
  }, [ctx]);

  function navigateNewRecipe() {
    // navigate('/recipes/0', { replace: true });
  }

  const stackStyles: IStackStyles = {
    root: {
      // background: DefaultPalette.themeTertiary,
    },
  };

  const itemAlignmentsStackTokens: IStackTokens = {
    childrenGap: 5,
    padding: 10,
  };

  const stackItemStyles: IStackItemStyles = {
    root: {
      // background: DefaultPalette.themePrimary,
      // color: DefaultPalette.white,
      padding: 5,
    },
  };

  function newRecipeButton() {
    if (isAuthenticated) {
      return (
        <DefaultButton
          text="New Recipe"
          onClick={navigateNewRecipe}
          allowDisabledFocus
        />
      );
    }
  }

  return (
    <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
      {newRecipeButton()}
      {recipes &&
        recipes.map((r) => {
          return (
            <Stack.Item
              key={r.id}
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
                      <a href={`/recipes/${r.id}`}>
                        <Text variant="xLarge" style={{ fontWeight: 'bold' }}>
                          {r.currentRevision?.name || `missing title`}
                        </Text>
                      </a>
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
                      <Stack.Item key={`${r.id}_${tag}`}>
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
                  {r.contributors?.map((contributor, idx) => (
                    <Stack.Item
                      style={{ fontWeight: 'bold' }}
                      key={`${r.id}_${contributor}`}
                    >
                      {contributor.displayName}
                      {idx < (r.contributors?.length || 0) - 1 ? ',' : ''}
                    </Stack.Item>
                  ))}
                </Stack>
              </Stack>
            </Stack.Item>
          );
        })}
    </Stack>
  );
}
