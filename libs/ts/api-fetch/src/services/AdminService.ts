/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { dtos_CreateRecipe } from '../models/dtos_CreateRecipe';
import type { models_Recipe } from '../models/models_Recipe';
import type { models_RecipeMedia } from '../models/models_RecipeMedia';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AdminService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Initialize Search Recipe Collection
     * Initialize Search Recipe Collection
     * @returns string OK
     * @throws ApiError
     */
    public postApiAdminInitSearchCollections(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/_admin/init-search-collections',
        });
    }

    /**
     * Bot Create a new Recipe
     * Bot Create a new Recipe
     * @param recipe Recipe Data
     * @returns models_Recipe OK
     * @throws ApiError
     */
    public postApiAdminRecipes(
        recipe: dtos_CreateRecipe,
    ): CancelablePromise<models_Recipe> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/_admin/recipes',
            body: recipe,
        });
    }

    /**
     * Get all medias for a Recipe
     * Get all medias for a Recipe
     * @param recipeId Recipe ID
     * @returns models_RecipeMedia OK
     * @throws ApiError
     */
    public getApiAdminRecipesMedia(
        recipeId: string,
    ): CancelablePromise<Array<models_RecipeMedia>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/_admin/recipes/{recipeID}/media',
            path: {
                'recipeID': recipeId,
            },
        });
    }

}