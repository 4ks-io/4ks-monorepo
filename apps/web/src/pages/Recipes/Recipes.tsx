import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import {
  Stack,
  IStackStyles,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';
import { DefaultButton } from '@fluentui/react/lib/Button';

import { useSessionContext } from '../../providers/session-context';
import { models_Recipe } from '@4ks/api-fetch';
import { PageLayout } from '../Layout';

const Recipes: React.FunctionComponent = () => {
  const ctx = useSessionContext();
  const { isAuthenticated } = useAuth0();

  const [recipes, setRecipes] = useState<models_Recipe[] | undefined>();

  useEffect(() => {
    if (ctx?.api) {
      ctx.api.recipes.getRecipes().then((r) => {
        setRecipes(r);
      });
    }
  }, [ctx]);

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
          onClick={() => {}}
          allowDisabledFocus
        />
      );
    }
  }

  return (
    <PageLayout>
      <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
        {newRecipeButton()}

        {recipes &&
          recipes.map((r) => (
            <Stack.Item key={r.id} align="auto" styles={stackItemStyles}>
              <span>
                <a href={`/recipes/${r.id}`}>{r.currentRevision?.name}</a>
              </span>
            </Stack.Item>
          ))}
      </Stack>
    </PageLayout>
  );
};

export default Recipes;
