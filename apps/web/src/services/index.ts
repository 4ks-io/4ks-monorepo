import { OpenAPI, RecipesService, UsersService } from '@4ks/api-fetch';

export interface API {
  recipes: RecipesService;
  users: UsersService;
}

export default function ApiServiceFactory(token: string): API {
  OpenAPI.TOKEN = token;
  OpenAPI.BASE = `/api`;

  return {
    recipes: RecipesService,
    users: UsersService,
  };
}
