import { models_Recipe, dtos_GetRecipeMediaResponse } from '@4ks/api-fetch';
import path from 'path';
import log from '@/libs/logger';
import { PagePropsParams, RecipePropsParams } from '@/libs/navigation';
import { z } from 'zod';

// todo: i18n
export enum RecipeViewPaths {
  Recipe = '',
  Media = '/media',
  Forks = '/forks',
  Comments = '/comments',
  // Story = "/story",
  Versions = '/versions',
  Settings = '/settings',
}

// getData
export enum RecipeView {
  '' = 0, // content
  'versions' = 2,
  'forks' = 3,
  'media' = 5,
  'comments' = 6,
  // 'story' = 8,
  'settings' = 9,
}

// https://github.com/colinhacks/zod#native-enums
enum PAGES {
  Content = '',
  Forks = 'forks',
  Media = 'media',
  Versions = 'versions',
  Settings = 'settings',
}
export const PageEnum = z.nativeEnum(PAGES);
export type PageEnum = z.infer<typeof PageEnum>;

export type RecipePageInfo = {
  id: string;
  // page: string;
  error: boolean;
};

export function getRecipeIdFromPageParams(
  params: PagePropsParams
): RecipePageInfo {
  let id = '';
  // let page = '';
  let error = false;

  parse: try {
    const segment = (params as unknown as RecipePropsParams).id;

    if (segment === '0') {
      return { id: segment, error };
    }

    // validate params
    // if (!Array.isArray(segment) || segment.length > 2) {
    //   break parse;
    // }

    // validate recipe id
    id = segment.split('-')[0] as string;
    const re = /^[a-zA-Z0-9][a-zA-Z0-9-]{18}[a-zA-Z0-9]$/i;
    const { success } = z.string().regex(re).safeParse(id);
    if (!success) {
      error = true;
    }

    // // if path, validate
    // if (segment.length === 2) {
    //   page = segment[1];
    //   if (!PageEnum.parse(page)) {
    //     error = true;
    //   }
    // }
  } catch (err) {
    error = true;
  }

  // catch-all
  return { id, error };
}
