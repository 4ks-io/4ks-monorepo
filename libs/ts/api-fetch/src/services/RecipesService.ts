/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { dtos_CreateRecipe } from '../models/dtos_CreateRecipe';
import type { dtos_CreateRecipeMedia } from '../models/dtos_CreateRecipeMedia';
import type { dtos_GetRecipesByUsername } from '../models/dtos_GetRecipesByUsername';
import type { dtos_UpdateRecipe } from '../models/dtos_UpdateRecipe';
import type { models_CreateRecipeMedia } from '../models/models_CreateRecipeMedia';
import type { models_Recipe } from '../models/models_Recipe';
import type { models_RecipeMedia } from '../models/models_RecipeMedia';
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
    public getApiRecipes(): CancelablePromise<Array<models_Recipe>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/recipes',
        });
    }

    /**
     * Create a new Recipe
     * Create a new Recipe
     * @param recipe Recipe Data
     * @returns models_Recipe OK
     * @throws ApiError
     */
    public postApiRecipes(
        recipe: dtos_CreateRecipe,
    ): CancelablePromise<models_Recipe> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/recipes',
            body: recipe,
        });
    }

    /**
     * Get All Recipes by Author
     * Get All Recipes by Author
     * @param username Username
     * @returns dtos_GetRecipesByUsername OK
     * @throws ApiError
     */
    public getApiRecipesAuthor(
        username: string,
    ): CancelablePromise<dtos_GetRecipesByUsername> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/recipes/author/{username}',
            path: {
                'username': username,
            },
        });
    }

    /**
     * Get a Recipe Revision
     * Get a Revision By ID
     * @param revisionId Revision ID
     * @returns models_RecipeRevision OK
     * @throws ApiError
     */
    public getApiRecipesRevisions(
        revisionId: string,
    ): CancelablePromise<models_RecipeRevision> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/recipes/revisions/{revisionID}',
            path: {
                'revisionID': revisionId,
            },
        });
    }

    /**
     * Get a Recipe (by ID)
     * Get a Recipe (by ID)
     * @param recipeId Recipe ID
     * @returns models_Recipe OK
     * @throws ApiError
     */
    public getApiRecipes1(
        recipeId: string,
    ): CancelablePromise<models_Recipe> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/recipes/{recipeID}',
            path: {
                'recipeID': recipeId,
            },
        });
    }

    /**
     * Delete Recipe
     * Delete Recipe
     * @param recipeId Recipe ID
     * @returns any OK
     * @throws ApiError
     */
    public deleteApiRecipes(
        recipeId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/recipes/{recipeID}',
            path: {
                'recipeID': recipeId,
            },
        });
    }

    /**
     * Update Recipe
     * Update Recipe
     * @param recipeId Recipe ID
     * @param payload Recipe Data
     * @returns models_Recipe OK
     * @throws ApiError
     */
    public patchApiRecipes(
        recipeId: string,
        payload: dtos_UpdateRecipe,
    ): CancelablePromise<models_Recipe> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/recipes/{recipeID}',
            path: {
                'recipeID': recipeId,
            },
            body: payload,
        });
    }

    /**
     * Fork Recipe
     * Fork Recipe
     * @param recipeId Recipe ID
     * @returns models_Recipe OK
     * @throws ApiError
     */
    public postApiRecipesFork(
        recipeId: string,
    ): CancelablePromise<models_Recipe> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/recipes/{recipeID}/fork',
            path: {
                'recipeID': recipeId,
            },
        });
    }

    /**
     * Get all medias for a Recipe
     * Get all medias for a Recipe
     * @param recipeId Recipe ID
     * @returns models_RecipeMedia OK
     * @throws ApiError
     */
    public getApiRecipesMedia(
        recipeId: string,
    ): CancelablePromise<Array<models_RecipeMedia>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/recipes/{recipeID}/media',
            path: {
                'recipeID': recipeId,
            },
        });
    }

    /**
     * Create a new Media SignedURL
     * Create a new Media SignedURL
     * @param recipeId Recipe ID
     * @param payload Payload
     * @returns models_CreateRecipeMedia OK
     * @throws ApiError
     */
    public postApiRecipesMedia(
        recipeId: string,
        payload: dtos_CreateRecipeMedia,
    ): CancelablePromise<models_CreateRecipeMedia> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/recipes/{recipeID}/media',
            path: {
                'recipeID': recipeId,
            },
            body: payload,
        });
    }

    /**
     * Get all revisions for a Recipe
     * Get all revisions for a Recipe
     * @param recipeId Recipe ID
     * @returns models_RecipeRevision OK
     * @throws ApiError
     */
    public getApiRecipesRevisions1(
        recipeId: string,
    ): CancelablePromise<Array<models_RecipeRevision>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/recipes/{recipeID}/revisions',
            path: {
                'recipeID': recipeId,
            },
        });
    }

    /**
     * Star Recipe
     * Star Recipe
     * @param recipeId Recipe ID
     * @returns any OK
     * @throws ApiError
     */
    public postApiRecipesStar(
        recipeId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/recipes/{recipeID}/star',
            path: {
                'recipeID': recipeId,
            },
        });
    }

}