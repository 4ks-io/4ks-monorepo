/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { models_RecipeMetada } from './models_RecipeMetada';
import type { models_RecipeRevision } from './models_RecipeRevision';
import type { models_UserSummary } from './models_UserSummary';

export type models_Recipe = {
    author?: models_UserSummary;
    contributors?: Array<models_UserSummary>;
    createdDate?: string;
    currentRevision?: models_RecipeRevision;
    id?: string;
    metadata?: models_RecipeMetada;
    source?: string;
    updatedDate?: string;
};
