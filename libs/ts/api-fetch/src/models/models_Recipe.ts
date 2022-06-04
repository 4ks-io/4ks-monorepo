/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { models_RecipeMetada } from './models_RecipeMetada';
import type { models_RecipeRevision } from './models_RecipeRevision';

export type models_Recipe = {
    createdDate?: string;
    currentRevision?: models_RecipeRevision;
    id?: string;
    metadata?: models_RecipeMetada;
    source?: string;
    updatedDate?: string;
};
