'use client';
import React, { useEffect, useContext, useReducer } from 'react';
import { trpc } from '@/trpc/client';
import {
  IRecipeContext,
  makeInitialState,
  initialState,
} from './recipe-context-init';
import {
  recipeContextReducer,
  RecipeContextAction,
} from './recipe-context-reducer';
import {
  models_Recipe,
  models_Ingredient,
  models_Instruction,
  models_RecipeMediaVariant,
  models_RecipeMedia,
} from '@4ks/api-fetch';

const RecipeContext = React.createContext<IRecipeContext>(initialState);

type RecipeContextProviderProps = {
  recipe: models_Recipe;
  media: models_RecipeMedia[];
  isAuthenticated: boolean;
  children: React.ReactNode;
};

export function RecipeContextProvider({
  recipe,
  media,
  isAuthenticated,
  children,
}: RecipeContextProviderProps) {
  // safety check
  if (!recipe.id) {
    console.log('ERROR: recipe id required');
    return;
  }

  const NO_RECIPE_ID = '-1';
  const recipeID = recipe.id;

  const recipeData = trpc.recipes.getByIDMutation.useMutation();
  const mediaData = trpc.recipes.getMediaByIDMutation.useMutation();

  const [state, dispatch] = useReducer(
    recipeContextReducer,
    makeInitialState(recipe, media)
  );

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
    const recipe = await recipeData.mutate(recipeID);
    await dispatch({ type: RecipeContextAction.SET_CONTENT, payload: recipe });
  }

  async function setMedia() {
    if (state?.recipe?.root) {
      const media = await mediaData.mutate(recipeID);
      dispatch({ type: RecipeContextAction.SET_MEDIA, payload: media });
    }
  }

  // useEffect(() => {
  //   if (state?.recipe?.id != NO_RECIPE_ID && state?.recipe?.root != '') {
  //     setMedia();
  //   }
  // }, [state?.recipe?.root]);

  useEffect(() => {
    if (isAuthenticated && state?.recipe?.id != NO_RECIPE_ID) {
      dispatch({
        type: RecipeContextAction.SET_CONTROLS,
        payload: {
          resetMedia: setMedia,
          resetRecipe: setRecipe,
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
