/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ApiService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Test JWT Auth
     * Test JWT Auth
     * @returns string OK
     * @throws ApiError
     */
    public getAuthTest(): CancelablePromise<string> {
        return this.httpRequest.request({
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
    public getVersion(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/version',
        });
    }

}