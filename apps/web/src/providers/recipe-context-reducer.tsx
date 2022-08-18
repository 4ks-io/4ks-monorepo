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
}

export function recipeContextReducer(state: IRecipeContext, action: IAction) {
  switch (action.type) {
    case RecipeContextAction.SET_ID:
      return { ...state, recipeId: action.payload };
    //
    case RecipeContextAction.SET_CONTENT:
      return { ...state, recipe: action.payload };
    //
    case RecipeContextAction.SET_CONTROLS:
      const { setIngredients, setInstructions } = action.payload;
      return {
        ...state,
        setIngredients,
        setInstructions,
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
    default:
      throw new Error();
  }
}
