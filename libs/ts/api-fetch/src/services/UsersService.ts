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
     * Get All Users
     * Get All Users
     * @returns models_User OK
     * @throws ApiError
     */
    public getUsers(): CancelablePromise<Array<models_User>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users',
        });
    }

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
     * Test if a username exists
     * Test if a username exists
     * @param username UserName
     * @returns boolean OK
     * @throws ApiError
     */
    public getUsersUsername(
        username: string,
    ): CancelablePromise<Array<boolean>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/username/{username}',
            path: {
                'username': username,
            },
        });
    }

    /**
     * Get a User (by ID)
     * Get a User (by ID)
     * @param userId User Id
     * @returns models_User OK
     * @throws ApiError
     */
    public getUsers1(
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