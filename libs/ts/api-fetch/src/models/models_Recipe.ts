/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { models_RecipeMetadata } from './models_RecipeMetadata';
import type { models_RecipeRevision } from './models_RecipeRevision';
import type { models_UserSummary } from './models_UserSummary';

export type models_Recipe = {
    author?: models_UserSummary;
    branch?: string;
    contributors?: Array<models_UserSummary>;
    createdDate?: string;
    currentRevision?: models_RecipeRevision;
    id?: string;
    metadata?: models_RecipeMetadata;
    root?: string;
    updatedDate?: string;
};
