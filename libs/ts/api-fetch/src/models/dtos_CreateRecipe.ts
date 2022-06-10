/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { models_Image } from './models_Image';
import type { models_Instruction } from './models_Instruction';

export type dtos_CreateRecipe = {
    images?: Array<models_Image>;
    instructions?: Array<models_Instruction>;
    name?: string;
};
