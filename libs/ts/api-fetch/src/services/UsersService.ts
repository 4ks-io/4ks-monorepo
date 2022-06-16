/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { dtos_CreateUser } from '../models/dtos_CreateUser';
import type { models_User } from '../models/models_User';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UsersService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create a new User
     * Create a new User
     * @param user User Data
     * @returns models_User OK
     * @throws ApiError
     */
    public postUsers(
        user: dtos_CreateUser,
    ): CancelablePromise<models_User> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users',
            body: user,
        });
    }

    /**
     * Get All Users
     * Get All Users
     * @returns models_User OK
     * @throws ApiError
     */
    public getUsersList(): CancelablePromise<Array<models_User>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/list',
        });
    }

    /**
     * Get Current User
     * Get Current User
     * @returns models_User OK
     * @throws ApiError
     */
    public getUsersProfile(): CancelablePromise<models_User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/profile',
        });
    }

    /**
     * Get a User (by ID)
     * Get a User (by ID)
     * @param userId User Id
     * @returns models_User OK
     * @throws ApiError
     */
    public getUsers(
        userId: string,
    ): CancelablePromise<models_User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/{userId}',
            path: {
                'userId': userId,
            },
        });
    }

    /**
     * Delete User
     * Delete User
     * @param userId User Id
     * @returns any
     * @throws ApiError
     */
    public deleteUsers(
        userId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
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
     * @returns models_User OK
     * @throws ApiError
     */
    public patchUsers(
        userId: string,
    ): CancelablePromise<Array<models_User>> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/users/{userId}',
            path: {
                'userId': userId,
            },
        });
    }

}