import React, { useEffect, useContext, useState } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
import { models_Recipe } from '@4ks/api-fetch';
import { useSessionContext } from './session-context';

export interface IRecipeContext {
  recipeId: string | undefined;
  recipe: models_Recipe | undefined;
}

const initialState = {
  recipeId: undefined,
  recipe: undefined,
};

const RecipeContext = React.createContext<IRecipeContext>(initialState);

type RecipeContextProviderProps = { children: React.ReactNode };

export function RecipeContextProvider({
  children,
}: RecipeContextProviderProps) {
  // const { isAuthenticated } = useAuth0();
  const ctx = useSessionContext();

  const [state, dispatch] = useState<IRecipeContext>(initialState);

  useEffect(() => {
    const recipedId = window.location.href.split('/').pop();
    ctx?.api?.recipes.getRecipes1(`${recipedId}`).then((r) => {
      dispatch({
        recipeId: recipedId,
        recipe: r,
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
