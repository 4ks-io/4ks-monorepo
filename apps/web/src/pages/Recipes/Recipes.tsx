import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { useNavigate, Link } from 'react-router-dom';
import { useSessionContext } from '../../providers/session-context';
import { models_Recipe } from '@4ks/api-fetch';
import RecipeTile from './RecipeTile';
import RecipeTileSkel from './RecipeTileSkel';
import { stackStyles, itemAlignmentsStackTokens } from './styles';

const Recipes = () => {
  const ctx = useSessionContext();
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<models_Recipe[] | undefined>();

  useEffect(() => {
    ctx.api?.recipes.getRecipes().then((r: models_Recipe[]) => {
      setRecipes(r);
    });
  }, [ctx]);

  function navigateNewRecipe() {
    navigate('/r/0');
  }

  if (!recipes) {
    return (
      <>
        <RecipeTileSkel key={0} />
        <RecipeTileSkel key={1} />
        <RecipeTileSkel key={2} />
      </>
    );
  }

  function NewRecipeButton() {
    return (
      isAuthenticated && (
        <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
          <DefaultButton
            text="New Recipe"
            onClick={navigateNewRecipe}
            allowDisabledFocus
          />
        </Stack>
      )
    );
  }

  return (
    <>
      <NewRecipeButton />
      <Stack
        horizontal
        horizontalAlign="space-between"
        wrap
        styles={stackStyles}
        tokens={itemAlignmentsStackTokens}
      >
        {recipes &&
          recipes.map((r) => {
            return <RecipeTile key={r.id} recipe={r} />;
          })}
      </Stack>
    </>
  );
};

export default Recipes;
