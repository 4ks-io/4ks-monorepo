/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { models_UserEventError } from './models_UserEventError';
import type { models_UserEventStatus } from './models_UserEventStatus';
import type { models_UserEventType } from './models_UserEventType';

export type models_UserEvent = {
    createdDate?: string;
    /**
     * data is to be unmarshalled based on UserEventStatus ONLY
     */
    data?: any;
    error?: models_UserEventError;
    id?: string;
    status?: models_UserEventStatus;
    type?: models_UserEventType;
    updatedDate?: string;
};
