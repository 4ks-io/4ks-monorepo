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
  media = [],
  isAuthenticated,
  children,
}: RecipeContextProviderProps) {
  const NO_RECIPE_ID = '-1';
  const recipeID = `${recipe.id}`;

  const recipeData = trpc.recipes.getByIDMutation.useMutation();
  const mediaData = trpc.recipes.getMediaByIDMutation.useMutation();

  const [state, dispatch] = useReducer(
    recipeContextReducer,
    makeInitialState(recipe, media)
  );

  // update media
  useEffect(() => {
    const { isLoading, data, isError, isSuccess } = mediaData;
    if (isLoading || isError || !isSuccess) {
      return;
    }
    if (data?.data && state.media.length != data?.data.length) {
      dispatch({ type: RecipeContextAction.SET_MEDIA, payload: data?.data });
    }
  }, [mediaData, state.media]);

  // update recipe
  useEffect(() => {
    const { isLoading, data, isError, isSuccess } = recipeData;
    if (isLoading || isError || !isSuccess) {
      return;
    }
    if (data?.data && state.recipe != data?.data) {
      dispatch({ type: RecipeContextAction.SET_CONTENT, payload: data.data });
    }
  }, [recipeData, state.recipe]);

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
    recipeData.mutate(recipeID);
  }

  async function setMedia() {
    mediaData.mutate(recipeID);
  }

  useEffect(() => {
    if (recipe?.id == NO_RECIPE_ID) {
      return;
    }

    if (isAuthenticated) {
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
      return;
    }

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe]);

  return (
    <RecipeContext.Provider value={state}>{children}</RecipeContext.Provider>
  );
}

export function useRecipeContext() {
  return useContext(RecipeContext);
}
