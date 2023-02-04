import { IRecipeContext } from './recipe-context-init';

interface IAction {
  type: RecipeContextAction;
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
  SET_BANNER = 'setBanner',
  SET_MEDIA = 'setMedia',
}

export function recipeContextReducer(
  state: IRecipeContext,
  action: IAction
): IRecipeContext {
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
    case RecipeContextAction.SET_MEDIA:
      return { ...state, media: action.payload };
    //
    case RecipeContextAction.SET_CONTROLS:
      const {
        resetMedia,
        resetRecipe,
        setEditing,
        setIngredients,
        setInstructions,
        setTitle,
        setBanner,
      } = action.payload;

      return {
        ...state,
        resetMedia,
        resetRecipe,
        setEditing,
        setIngredients,
        setInstructions,
        setTitle,
        setBanner,
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
    case RecipeContextAction.SET_BANNER:
      return {
        ...state,
        recipe: {
          ...state.recipe,
          currentRevision: {
            ...state.recipe.currentRevision,
            banner: action.payload,
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
