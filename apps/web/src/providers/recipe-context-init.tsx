import {
  models_Recipe,
  models_Ingredient,
  models_Instruction,
  models_RecipeMediaVariant,
} from '@4ks/api-fetch';
import { models_RecipeMedia } from '../../../../libs/ts/api-fetch/dist';

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

export const initialState: IRecipeContext = {
  resetRecipe: () => {},
  resetMedia: () => {},
  setEditing: () => {},
  setTitle: () => {},
  setIngredients: () => {},
  setInstructions: () => {},
  setBanner: () => {},
  recipeId: '0',
  editing: false,
  media: [],
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
