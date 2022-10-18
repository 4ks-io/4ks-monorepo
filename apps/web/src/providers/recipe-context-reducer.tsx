import { IRecipeContext, initialState } from './recipe-context-init';

interface IAction {
  type: string;
  payload?: any;
}

export enum RecipeContextAction {
  SET_ID = 'setRecipeId',
  SET_CONTENT = 'setRecipeContent',
  SET_CONTROLS = 'setRecipeControls',
  SET_INGREDIENTS = 'setRecipeIngredients',
  SET_INSTRUCTIONS = 'setRecipeInstructions',
  SET_TITLE = 'setRecipeTitle',
  SET_EDIT_MODE = 'setEditMode',
}

export function recipeContextReducer(state: IRecipeContext, action: IAction) {
  switch (action.type) {
    //
    case RecipeContextAction.SET_EDIT_MODE:
      return { ...state, editing: action.payload };
    //
    case RecipeContextAction.SET_ID:
      return { ...state, recipeId: action.payload };
    //
    case RecipeContextAction.SET_CONTENT:
      return { ...state, recipe: action.payload };
    //
    case RecipeContextAction.SET_CONTROLS:
      const {
        resetRecipe,
        setEditing,
        setIngredients,
        setInstructions,
        setTitle,
      } = action.payload;

      return {
        ...state,
        resetRecipe,
        setEditing,
        setIngredients,
        setInstructions,
        setTitle,
      };
    //
    case RecipeContextAction.SET_INGREDIENTS:
      return {
        ...state,
        recipe: {
          ...state.recipe,
          currentRevision: {
            ...state.recipe.currentRevision,
            ingredients: action.payload,
          },
        },
      };
    //
    case RecipeContextAction.SET_INSTRUCTIONS:
      return {
        ...state,
        recipe: {
          ...state.recipe,
          currentRevision: {
            ...state.recipe.currentRevision,
            instructions: action.payload,
          },
        },
      };
    //
    case RecipeContextAction.SET_TITLE:
      return {
        ...state,
        recipe: {
          ...state.recipe,
          currentRevision: {
            ...state.recipe.currentRevision,
            name: action.payload,
          },
        },
      };
    //
    default:
      throw new Error();
  }
}
