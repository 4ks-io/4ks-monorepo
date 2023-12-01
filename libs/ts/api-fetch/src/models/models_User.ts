/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { models_UserEvent } from './models_UserEvent';

export type models_User = {
    createdDate?: string;
    displayName?: string;
    emailAddress?: string;
    events?: Array<models_UserEvent>;
    id?: string;
    updatedDate?: string;
    username?: string;
    usernameLower?: string;
};
