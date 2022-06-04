/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { models_Recipe } from '../models/models_Recipe';
import type { models_RecipeRevision } from '../models/models_RecipeRevision';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RecipesService {

    /**
     * Create a new recipe
     * Create a new recipe
     * @returns models_Recipe OK
     * @throws ApiError
     */
    public static postRecipes(): CancelablePromise<Array<models_Recipe>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recipes',
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
     * Get a recipe by ID
     * Get a recipe by ID
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
     * Get all revisions for a recipe
     * Get all revisions for a recipe
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

}