import { models_User, models_Recipe, models_RecipeMedia } from '@4ks/api-fetch';

export type RecipeProps = {
  user: models_User | undefined;
  recipe: models_Recipe;
  media: models_RecipeMedia[];
};
