/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { dtos_CreateRecipe } from '../models/dtos_CreateRecipe';
import type { dtos_UpdateRecipe } from '../models/dtos_UpdateRecipe';
import type { models_Recipe } from '../models/models_Recipe';
import type { models_RecipeRevision } from '../models/models_RecipeRevision';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class RecipesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get All Recipes
     * Get All Recipes
     * @returns models_Recipe OK
     * @throws ApiError
     */
    public getRecipes(): CancelablePromise<Array<models_Recipe>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/recipes',
        });
    }

    /**
     * Create a new Recipe
     * Create a new Recipe
     * @param recipe Recipe Data
     * @returns models_Recipe OK
     * @throws ApiError
     */
    public postRecipes(
        recipe: dtos_CreateRecipe,
    ): CancelablePromise<models_Recipe> {
        return this.httpRequest.request({
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
    public getRecipesRevisions(
        revisionId: string,
    ): CancelablePromise<models_RecipeRevision> {
        return this.httpRequest.request({
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
    public getRecipes1(
        recipeId: string,
    ): CancelablePromise<models_Recipe> {
        return this.httpRequest.request({
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
     * @param recipeUpdate Recipe Update
     * @returns models_Recipe OK
     * @throws ApiError
     */
    public patchRecipes(
        recipeId: string,
        recipeUpdate: dtos_UpdateRecipe,
    ): CancelablePromise<models_Recipe> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/recipes/{recipeId}',
            path: {
                'recipeId': recipeId,
            },
            body: recipeUpdate,
        });
    }

    /**
     * Fork Recipe
     * Fork Recipe
     * @param recipeId Recipe Id
     * @returns models_Recipe OK
     * @throws ApiError
     */
    public postRecipesFork(
        recipeId: string,
    ): CancelablePromise<models_Recipe> {
        return this.httpRequest.request({
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
    public getRecipesRevisions1(
        recipeId: string,
    ): CancelablePromise<Array<models_RecipeRevision>> {
        return this.httpRequest.request({
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
     * @returns any OK
     * @throws ApiError
     */
    public postRecipesStar(
        recipeId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/recipes/{recipeId}/star',
            path: {
                'recipeId': recipeId,
            },
        });
    }

}