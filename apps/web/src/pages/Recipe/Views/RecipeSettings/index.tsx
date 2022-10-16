import React, { useEffect, useState } from 'react';
import { RecipeDangerZone } from './RecipeDangerZone';
import { useAuth0 } from '@auth0/auth0-react';
import { useSessionContext } from '../../../../providers/session-context';
import { useRecipeContext } from '../../../../providers/recipe-context';

const RecipeSettingsView = () => {
  const { isAuthenticated } = useAuth0();
  const ctx = useSessionContext();
  const rtx = useRecipeContext();

  const [isRecipeContributor, setIsRecipeContributor] = useState(false);

  useEffect(() => {
    setIsRecipeContributor(
      (isAuthenticated &&
        rtx?.recipe.contributors?.map((c) => c.id).includes(ctx.user?.id)) ||
        false
    );
  }, [rtx, ctx.user]);

  return (
    <>
      {rtx?.recipeId && rtx?.recipeId != '0' && isRecipeContributor && (
        <RecipeDangerZone />
      )}
    </>
  );
};

export { RecipeSettingsView };
export default { RecipeSettingsView };
