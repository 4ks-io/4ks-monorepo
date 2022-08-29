import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Icon } from '@fluentui/react/lib/Icon';

import {
  Stack,
  IStackStyles,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { useNavigate } from 'react-router-dom';

import { useSessionContext } from '../../providers/session-context';
import { models_Recipe } from '@4ks/api-fetch';
import { PageLayout } from '../Layout';

const stackTokens: IStackTokens = {
  childrenGap: 1,
};

const Recipes: React.FunctionComponent = () => {
  const ctx = useSessionContext();
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<models_Recipe[] | undefined>();

  function refreshRecipes() {
    ctx?.api?.recipes.getRecipes().then((r) => {
      setRecipes(r);
    });
  }
  useEffect(() => {
    refreshRecipes();
  }, [ctx]);

  function navigateNewRecipe() {
    navigate('/recipes/0', { replace: true });
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
    <PageLayout>
      <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
        {newRecipeButton()}

        {recipes &&
          recipes.map((r) => {
            const handleDelete = () => {
              // todo - check that author is current user
              // r.author
              r.id &&
                ctx?.api?.recipes
                  .deleteRecipes(r.id)
                  .then(() => refreshRecipes());
            };

            return (
              <Stack.Item key={r.id}>
                <Stack horizontal styles={stackStyles} tokens={stackTokens}>
                  <Stack.Item align="auto" styles={stackItemStyles}>
                    <span>
                      <a href={`/recipes/${r.id}`}>
                        {r.currentRevision?.name || `missing title`}
                      </a>
                    </span>
                  </Stack.Item>
                  <Stack.Item>
                    <Icon iconName="Delete" onClick={handleDelete} />
                  </Stack.Item>
                </Stack>
              </Stack.Item>
            );
          })}
      </Stack>
    </PageLayout>
  );
};

export default Recipes;
