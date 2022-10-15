import {
  models_Recipe,
  models_Ingredient,
  models_Instruction,
} from '@4ks/api-fetch';

export interface IRecipeContext {
  recipeId: string;
  editing: boolean;
  recipe: models_Recipe;
  setEditing: (editing: boolean) => void;
  setTitle: (title: string) => void;
  setIngredients: (ingredients: models_Ingredient[]) => void;
  setInstructions: (instructions: models_Instruction[]) => void;
}

export const initialState: IRecipeContext = {
  setEditing: () => {},
  setTitle: () => {},
  setIngredients: () => {},
  setInstructions: () => {},
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
