import {
  OpenAPI,
  // ProjectsService,
  RecipesService,
} from '@4ks/api-fetch';

export interface API {
  recipes: typeof RecipesService;
}

export default function ApiServiceFactory(token: string): API {
  OpenAPI.TOKEN = token;
  OpenAPI.BASE = `/api`;

  return {
    recipes: RecipesService,
  };
}