import React, { useEffect, useContext, useReducer } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  models_Ingredient,
  models_Instruction,
  models_Recipe,
  models_RecipeMediaVariant,
} from '@4ks/api-fetch';
import { useSessionContext } from '..';
import { IRecipeContext, initialState } from './recipe-context-init';
import {
  recipeContextReducer,
  RecipeContextAction,
} from './recipe-context-reducer';
import { useParams } from 'react-router-dom';

const RecipeContext = React.createContext<IRecipeContext>(initialState);

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

  function setBanner(banner: Array<models_RecipeMediaVariant>) {
    dispatch({
      type: RecipeContextAction.SET_BANNER,
      payload: banner,
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

  async function setRecipe() {
    const recipe: models_Recipe = await ctx?.api?.recipes.getRecipes1(
      state.recipeId
    );
    await dispatch({ type: RecipeContextAction.SET_CONTENT, payload: recipe });
  }

  async function setMedia() {
    if (ctx?.api && state?.recipe?.root) {
      const media = await ctx.api?.recipes.getRecipesMedia(state.recipe.root);
      dispatch({ type: RecipeContextAction.SET_MEDIA, payload: media });
    }
  }

  useEffect(() => {
    if (recipeId != NO_RECIPE_ID) {
      dispatch({
        type: RecipeContextAction.SET_ID,
        payload: recipeId,
      });
    }
  }, [recipeId]);

  useEffect(() => {
    if (state.recipeId) {
      if (state.recipeId == NO_RECIPE_ID) {
        setEditing(true);
      } else {
        setEditing(false);
        setRecipe();
      }
    }
  }, [ctx?.api, state.recipeId]);

  useEffect(() => {
    if (state?.recipe?.id != NO_RECIPE_ID && state?.recipe?.root != '') {
      setMedia();
    }
  }, [state?.recipe?.root]);

  useEffect(() => {
    if (isAuthenticated && state?.recipe?.id != NO_RECIPE_ID) {
      dispatch({
        type: RecipeContextAction.SET_CONTROLS,
        payload: {
          resetMedia: setMedia,
          resetRecipe: setRecipe,
          setEditing,
          setTitle,
          setIngredients,
          setInstructions,
          setBanner,
        },
      });
    } else {
      if (state?.recipe?.id != NO_RECIPE_ID) {
        dispatch({
          type: RecipeContextAction.SET_CONTROLS,
          payload: {
            resetMedia: setMedia,
            resetRecipe: setRecipe,
            setEditing,
            setBanner,
            setTitle: () => {},
            setIngredients: () => {},
            setInstructions: () => {},
          },
        });
      }
    }
  }, [state?.recipe?.id]);

  return (
    <RecipeContext.Provider value={state}>{children}</RecipeContext.Provider>
  );
}

export function useRecipeContext() {
  return useContext(RecipeContext);
}
