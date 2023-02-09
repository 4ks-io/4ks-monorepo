/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { models_Ingredient } from './models_Ingredient';
import type { models_Instruction } from './models_Instruction';
import type { models_RecipeMediaVariant } from './models_RecipeMediaVariant';

export type dtos_CreateRecipe = {
    banner?: Array<models_RecipeMediaVariant>;
    ingredients?: Array<models_Ingredient>;
    instructions?: Array<models_Instruction>;
    link?: string;
    name?: string;
};
