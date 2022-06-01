/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { models_Image } from './models_Image';
import type { models_Instruction } from './models_Instruction';
import type { models_UserSummary } from './models_UserSummary';

export type models_RecipeRevision = {
    author?: models_UserSummary;
    createdDate?: string;
    id?: string;
    images?: Array<models_Image>;
    instructions?: Array<models_Instruction>;
    name?: string;
    recipeId?: string;
    updatedDate?: string;
};
