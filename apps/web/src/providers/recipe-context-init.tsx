import {
  models_Recipe,
  models_Ingredient,
  models_Instruction,
  models_RecipeMediaVariant,
} from '@4ks/api-fetch';

export interface IRecipeContext {
  recipeId: string;
  editing: boolean;
  recipe: models_Recipe;
  resetRecipe: () => void;
  setEditing: (editing: boolean) => void;
  setTitle: (title: string) => void;
  setBanner: (banner: Array<models_RecipeMediaVariant>) => void;
  setIngredients: (ingredients: models_Ingredient[]) => void;
  setInstructions: (instructions: models_Instruction[]) => void;
}

export const initialState: IRecipeContext = {
  resetRecipe: () => {},
  setEditing: () => {},
  setTitle: () => {},
  setIngredients: () => {},
  setInstructions: () => {},
  setBanner: () => {},
  recipeId: '0',
  editing: false,
  recipe: {
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
      images: [],
      ingredients: [],
      instructions: [],
      banner: [],
      name: '',
      recipeId: '',
      updatedDate: '',
    },
    id: '',
    metadata: { forks: 0, stars: 0 },
    source: '',
    updatedDate: '',
  },
};
