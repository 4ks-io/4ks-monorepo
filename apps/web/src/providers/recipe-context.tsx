import React, { useEffect, useContext, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { models_Recipe, dtos_UpdateRecipe } from '@4ks/api-fetch';
import { useSessionContext } from './session-context';

export interface IRecipeContext {
  recipeId: string;
  recipe: models_Recipe;
  onSave: () => void;
}

const RecipeContext = React.createContext<IRecipeContext | undefined>(
  undefined
);

type RecipeContextProviderProps = { children: React.ReactNode };

export function RecipeContextProvider({
  children,
}: RecipeContextProviderProps) {
  const { isAuthenticated } = useAuth0();
  const ctx = useSessionContext();

  const [state, dispatch] = useState<IRecipeContext>();

  function onSave() {
    if (state && isAuthenticated) {
      const { recipeId, recipe } = state;
      ctx?.api?.recipes.patchRecipes(recipeId, recipe as dtos_UpdateRecipe);
    }
  }

  useEffect(() => {
    const recipedId = window.location.href.split('/').pop() as string;
    ctx?.api?.recipes.getRecipes1(`${recipedId}`).then((r) => {
      dispatch({
        recipeId: recipedId,
        recipe: r,
        onSave: onSave,
      });
    });
  }, [ctx]);

  return (
    <RecipeContext.Provider value={state}>{children}</RecipeContext.Provider>
  );
}

export function useRecipeContext() {
  return useContext(RecipeContext);
}
