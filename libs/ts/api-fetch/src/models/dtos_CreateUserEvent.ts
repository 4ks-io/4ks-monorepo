/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { models_UserEventStatus } from './models_UserEventStatus';
import type { models_UserEventType } from './models_UserEventType';

export type dtos_CreateUserEvent = {
    data?: any;
    status?: models_UserEventStatus;
    type?: models_UserEventType;
};
