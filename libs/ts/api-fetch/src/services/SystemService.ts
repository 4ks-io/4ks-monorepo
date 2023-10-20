/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class SystemService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * healthcheck
     * healthcheck
     * @returns void
     * @throws ApiError
     */
    public getHealthcheck(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/healthcheck',
        });
    }

    /**
     * Checks Readiness
     * Check system readiness by probing downstream services such as the database.
     * @returns string OK
     * @throws ApiError
     */
    public getReady(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/ready',
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