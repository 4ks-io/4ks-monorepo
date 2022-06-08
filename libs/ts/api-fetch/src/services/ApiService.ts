/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ApiService {

    /**
     * Test JWT Auth
     * Test JWT Auth
     * @returns string OK
     * @throws ApiError
     */
    public static getAuthTest(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth-test',
        });
    }

    /**
     * Get API Version
     * Get API Version
     * @returns string OK
     * @throws ApiError
     */
    public static getVersion(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/version',
        });
    }

}