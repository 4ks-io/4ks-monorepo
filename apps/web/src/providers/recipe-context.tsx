import React, { useEffect, useContext, useReducer } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { models_Ingredient, models_Instruction } from '@4ks/api-fetch';
import { useSessionContext } from './session-context';
import { IRecipeContext, initialState } from './recipe-context-init';
import {
  recipeContextReducer,
  RecipeContextAction,
} from './recipe-context-reducer';

const RecipeContext = React.createContext<IRecipeContext | undefined>(
  undefined
);

type RecipeContextProviderProps = { children: React.ReactNode };

export function RecipeContextProvider({
  children,
}: RecipeContextProviderProps) {
  const { isAuthenticated } = useAuth0();
  const ctx = useSessionContext();

  const [state, dispatch] = useReducer(recipeContextReducer, initialState);

  function setIngredients(ingredients: models_Ingredient[]) {
    dispatch({
      type: RecipeContextAction.SET_INGREDIENTS,
      payload: ingredients,
    });
  }

  function setInstructions(instructions: models_Instruction[]) {
    dispatch({
      type: RecipeContextAction.SET_INSTRUCTIONS,
      payload: instructions,
    });
  }

  useEffect(() => {
    const recipeId = window.location.href.split('/').pop() as string;
    dispatch({
      type: RecipeContextAction.SET_ID,
      payload: recipeId,
    });
  }, []);

  useEffect(() => {
    ctx?.api?.recipes.getRecipes1(`${state.recipeId}`).then((recipe) => {
      dispatch({ type: RecipeContextAction.SET_CONTENT, payload: recipe });
    });
  }, [state.recipeId]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch({
        type: RecipeContextAction.SET_CONTROLS,
        payload: {
          setIngredients,
          setInstructions,
        },
      });
    }
  }, [state.recipe.id]);

  return (
    <RecipeContext.Provider value={state}>{children}</RecipeContext.Provider>
  );
}

export function useRecipeContext() {
  return useContext(RecipeContext);
}
