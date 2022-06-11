/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { dtos_CreateUser } from '../models/dtos_CreateUser';
import type { models_RecipeRevision } from '../models/models_RecipeRevision';
import type { models_User } from '../models/models_User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UsersService {

    /**
     * Create a new User
     * Create a new User
     * @param user User Data
     * @returns models_User OK
     * @throws ApiError
     */
    public static postUsers(
        user: dtos_CreateUser,
    ): CancelablePromise<Array<models_User>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users',
            body: user,
        });
    }

    /**
     * Get a User (by ID)
     * Get a User (by ID)
     * @param userId User Id
     * @returns models_User OK
     * @throws ApiError
     */
    public static getUsers(
        userId: string,
    ): CancelablePromise<Array<models_User>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{userId}',
            path: {
                'userId': userId,
            },
        });
    }

    /**
     * Update User
     * Update User
     * @param userId User Id
     * @returns models_RecipeRevision OK
     * @throws ApiError
     */
    public static patchUsers(
        userId: string,
    ): CancelablePromise<Array<models_RecipeRevision>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/{userId}',
            path: {
                'userId': userId,
            },
        });
    }

}