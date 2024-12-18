import {
  models_Recipe,
  models_Ingredient,
  models_Instruction,
  models_RecipeMediaVariant,
  models_RecipeMedia,
  models_RecipeRevision,
} from '@4ks/api-fetch';

export interface IRecipeContext {
  recipeId: string;
  recipe: models_Recipe;
  immutableRecipe: models_Recipe;
  media: Array<models_RecipeMedia>;
  resetMedia: () => void;
  resetRecipe: () => void;
  setTitle: (title: string) => void;
  setBanner: (banner: Array<models_RecipeMediaVariant>) => void;
  setIngredients: (ingredients: models_Ingredient[]) => void;
  setInstructions: (instructions: models_Instruction[]) => void;
  actionInProgress: boolean;
  setActionInProgress: (value: boolean) => void;
  editInProgress: boolean;
  setEditInProgress: (value: boolean) => void;
}

const initialRecipeRevision: models_RecipeRevision = {
  author: {
    displayName: '',
    id: '',
    username: '',
  },
  createdDate: '',
  id: '',
  ingredients: [],
  instructions: [],
  banner: [],
  name: '',
  recipeId: '',
  updatedDate: '',
};

export const initialRecipe: models_Recipe = {
  author: {
    displayName: '',
    id: '',
    username: '',
  },
  contributors: [],
  createdDate: '',
  currentRevision: initialRecipeRevision,
  id: '0',
  metadata: { forks: 0, stars: 0 },
  root: '',
  branch: '',
  updatedDate: '',
};

export const initialState: IRecipeContext = {
  resetRecipe: () => {},
  resetMedia: () => {},
  setTitle: () => {},
  setIngredients: () => {},
  setInstructions: () => {},
  setBanner: () => {},
  actionInProgress: false,
  setActionInProgress: () => {},
  editInProgress: false,
  setEditInProgress: () => {},
  recipeId: '-1',
  media: [],
  recipe: initialRecipe,
  immutableRecipe: initialRecipeRevision,
};

export function makeInitialState(
  recipe: models_Recipe,
  media: models_RecipeMedia[]
) {
  let i = initialState;
  i.recipeId = `${recipe.id}`;
  i.recipe = recipe;
  i.immutableRecipe = recipe.currentRevision as models_RecipeRevision;
  i.media = media;
  return i;
}
