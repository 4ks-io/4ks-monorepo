import {
  models_Recipe,
  models_Ingredient,
  models_Instruction,
  models_RecipeMediaVariant,
  models_RecipeMedia,
} from '@4ks/api-fetch';

export interface IRecipeContext {
  recipeId: string;
  editing: boolean;
  recipe: models_Recipe;
  media: Array<models_RecipeMedia>;
  resetMedia: () => void;
  resetRecipe: () => void;
  setEditing: (editing: boolean) => void;
  setTitle: (title: string) => void;
  setBanner: (banner: Array<models_RecipeMediaVariant>) => void;
  setIngredients: (ingredients: models_Ingredient[]) => void;
  setInstructions: (instructions: models_Instruction[]) => void;
}

const initialRecipe: models_Recipe = {
  author: {
    displayName: '',
    id: '',
    username: '',
  },
  contributors: [],
  createdDate: '',
  currentRevision: {
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
  },
  id: '',
  metadata: { forks: 0, stars: 0 },
  root: '',
  branch: '',
  updatedDate: '',
};

export const initialState: IRecipeContext = {
  resetRecipe: () => {},
  resetMedia: () => {},
  setEditing: () => {},
  setTitle: () => {},
  setIngredients: () => {},
  setInstructions: () => {},
  setBanner: () => {},
  recipeId: '0',
  editing: true,
  media: [],
  recipe: initialRecipe,
};
