import React, { useEffect, useContext, useReducer } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  models_Ingredient,
  models_Instruction,
  models_Recipe,
} from '@4ks/api-fetch';
import { useSessionContext } from './session-context';
import { IRecipeContext, initialState } from './recipe-context-init';
import {
  recipeContextReducer,
  RecipeContextAction,
} from './recipe-context-reducer';
import { useParams } from 'react-router-dom';

const RecipeContext = React.createContext<IRecipeContext | undefined>(
  undefined
);

type RecipeContextProviderProps = { children: React.ReactNode };

export function RecipeContextProvider({
  children,
}: RecipeContextProviderProps) {
  const { isAuthenticated } = useAuth0();
  const ctx = useSessionContext();
  let { recipeId } = useParams();

  const [state, dispatch] = useReducer(recipeContextReducer, initialState);
  const NO_RECIPE_ID = '0';

  function setEditing(editing: boolean) {
    dispatch({
      type: RecipeContextAction.SET_EDIT_MODE,
      payload: editing,
    });
  }

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

  function setTitle(title: string) {
    dispatch({
      type: RecipeContextAction.SET_TITLE,
      payload: title,
    });
  }

  function resetRecipe() {
    ctx?.api?.recipes
      .getRecipes1(`${state.recipeId}`)
      .then((recipe: models_Recipe) => {
        dispatch({ type: RecipeContextAction.SET_CONTENT, payload: recipe });
      });
  }

  useEffect(() => {
    recipeId != NO_RECIPE_ID &&
      dispatch({
        type: RecipeContextAction.SET_ID,
        payload: recipeId,
      });
  }, [recipeId]);

  useEffect(() => {
    if (state.recipeId) {
      if (state.recipeId == NO_RECIPE_ID) {
        setEditing(true);
      } else {
        setEditing(false);
        ctx?.api?.recipes
          .getRecipes1(`${state.recipeId}`)
          .then((recipe: models_Recipe) => {
            dispatch({
              type: RecipeContextAction.SET_CONTENT,
              payload: recipe,
            });
          });
      }
    }
  }, [state.recipeId]);

  useEffect(() => {
    if (isAuthenticated && state.recipe.id != NO_RECIPE_ID) {
      dispatch({
        type: RecipeContextAction.SET_CONTROLS,
        payload: {
          resetRecipe,
          setEditing,
          setTitle,
          setIngredients,
          setInstructions,
        },
      });
    } else {
      if (state.recipe.id != NO_RECIPE_ID) {
        dispatch({
          type: RecipeContextAction.SET_CONTROLS,
          payload: {
            resetRecipe,
            setEditing,
            setTitle: () => {},
            setIngredients: () => {},
            setInstructions: () => {},
          },
        });
      }
    }
  }, [state.recipe.id]);

  return (
    <RecipeContext.Provider value={state}>{children}</RecipeContext.Provider>
  );
}

export function useRecipeContext() {
  return useContext(RecipeContext);
}
