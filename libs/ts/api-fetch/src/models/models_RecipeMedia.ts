/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { models_RecipeMediaVariant } from './models_RecipeMediaVariant';

export type models_RecipeMedia = {
    bestUse?: number;
    contentType?: string;
    createdDate?: string;
    id?: string;
    ownerId?: string;
    recipeId?: string;
    rootRecipeId?: string;
    status?: number;
    updatedDate?: string;
    variants?: Array<models_RecipeMediaVariant>;
};
