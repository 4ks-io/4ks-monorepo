/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { models_RecipeRevision } from '../models/models_RecipeRevision';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RecipesService {

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