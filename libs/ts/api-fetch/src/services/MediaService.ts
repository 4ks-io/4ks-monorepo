/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { dtos_NewMedia } from '../models/dtos_NewMedia';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class MediaService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create a new Media
     * Create a new Media
     * @param payload Payload
     * @returns string OK
     * @throws ApiError
     */
    public postMediaToken(
        payload: dtos_NewMedia,
    ): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/media/token',
            body: payload,
        });
    }

}