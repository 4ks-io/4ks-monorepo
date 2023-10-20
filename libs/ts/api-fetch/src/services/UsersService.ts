/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { dtos_CreateUser } from '../models/dtos_CreateUser';
import type { dtos_TestUserName } from '../models/dtos_TestUserName';
import type { dtos_UpdateUser } from '../models/dtos_UpdateUser';
import type { models_User } from '../models/models_User';
import type { models_UserExist } from '../models/models_UserExist';
import type { models_Username } from '../models/models_Username';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UsersService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get Current User
     * Get Current User
     * @returns models_User OK
     * @throws ApiError
     */
    public getUser(): CancelablePromise<models_User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/user',
        });
    }

    /**
     * Create a new User
     * Create a new User
     * @param user User Data
     * @returns models_User OK
     * @throws ApiError
     */
    public postUser(
        user: dtos_CreateUser,
    ): CancelablePromise<models_User> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/user',
            body: user,
        });
    }

    /**
     * Head Authenticated user
     * Head Authenticated user
     * @returns any OK
     * @throws ApiError
     */
    public headUser(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'HEAD',
            url: '/user',
            errors: {
                400: `Invalid Request`,
                404: `Record Not Found`,
                500: `Internal Error`,
            },
        });
    }

    /**
     * Update User
     * Update User
     * @param payload User Data
     * @returns models_User OK
     * @throws ApiError
     */
    public patchUser(
        payload: dtos_UpdateUser,
    ): CancelablePromise<models_User> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/user',
            body: payload,
        });
    }

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
     * Get Current User Exist
     * Get Current User Exist
     * @returns models_UserExist OK
     * @throws ApiError
     */
    public getUsersExist(): CancelablePromise<models_UserExist> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/exist',
        });
    }

    /**
     * Test if a username exists
     * Test if a username exists
     * @param username Username Data
     * @returns models_Username OK
     * @throws ApiError
     */
    public postUsersUsername(
        username: dtos_TestUserName,
    ): CancelablePromise<models_Username> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/username',
            body: username,
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
     * @returns any OK
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

}