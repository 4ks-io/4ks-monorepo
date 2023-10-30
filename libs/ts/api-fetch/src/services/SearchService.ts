/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class SearchService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Initialize Search Recipe Collection
     * Initialize Search Recipe Collection
     * @returns string OK
     * @throws ApiError
     */
    public postApiSearchInitRecipeCollection(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/search/init/recipe-collection',
        });
    }

}