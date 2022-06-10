/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { dtos_CreateRecipe } from '../models/dtos_CreateRecipe';
import type { models_Recipe } from '../models/models_Recipe';
import type { models_RecipeRevision } from '../models/models_RecipeRevision';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RecipesService {

    /**
     * Create a new Recipe
     * Create a new Recipe
     * @param recipe Recipe Data
     * @returns models_Recipe OK
     * @throws ApiError
     */
    public static postRecipes(
        recipe: dtos_CreateRecipe,
    ): CancelablePromise<Array<models_Recipe>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recipes',
            body: recipe,
        });
    }

    /**
     * Get a Recipe Revision
     * Get a Revision By Id
     * @param revisionId Revision Id
     * @returns models_RecipeRevision OK
     * @throws ApiError
     */
    public static getRecipesRevisions(
        revisionId: string,
    ): CancelablePromise<models_RecipeRevision> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recipes/revisions/{revisionId}',
            path: {
                'revisionId': revisionId,
            },
        });
    }

    /**
     * Get a Recipe (by ID)
     * Get a Recipe (by ID)
     * @param recipeId Recipe Id
     * @returns models_Recipe OK
     * @throws ApiError
     */
    public static getRecipes(
        recipeId: string,
    ): CancelablePromise<Array<models_Recipe>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recipes/{recipeId}',
            path: {
                'recipeId': recipeId,
            },
        });
    }

    /**
     * Update Recipe
     * Update Recipe
     * @param recipeId Recipe Id
     * @returns models_RecipeRevision OK
     * @throws ApiError
     */
    public static patchRecipes(
        recipeId: string,
    ): CancelablePromise<Array<models_RecipeRevision>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/recipes/{recipeId}',
            path: {
                'recipeId': recipeId,
            },
        });
    }

    /**
     * Fork Recipe
     * Fork Recipe
     * @param recipeId Recipe Id
     * @returns models_RecipeRevision OK
     * @throws ApiError
     */
    public static postRecipesFork(
        recipeId: string,
    ): CancelablePromise<Array<models_RecipeRevision>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recipes/{recipeId}/fork',
            path: {
                'recipeId': recipeId,
            },
        });
    }

    /**
     * Get all revisions for a Recipe
     * Get all revisions for a Recipe
     * @param recipeId Recipe Id
     * @returns models_RecipeRevision OK
     * @throws ApiError
     */
    public static getRecipesRevisions1(
        recipeId: string,
    ): CancelablePromise<Array<models_RecipeRevision>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recipes/{recipeId}/revisions',
            path: {
                'recipeId': recipeId,
            },
        });
    }

    /**
     * Star Recipe
     * Star Recipe
     * @param recipeId Recipe Id
     * @returns models_RecipeRevision OK
     * @throws ApiError
     */
    public static postRecipesStar(
        recipeId: string,
    ): CancelablePromise<Array<models_RecipeRevision>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recipes/{recipeId}/star',
            path: {
                'recipeId': recipeId,
            },
        });
    }

}