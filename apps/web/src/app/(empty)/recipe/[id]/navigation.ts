import { PagePropsParams, RecipePropsParams } from '@/libs/navigation';
import { z } from 'zod';

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

    // validate recipe id
    id = segment.split('-')[0] as string;
    const re = /^[a-zA-Z0-9][a-zA-Z0-9-]{18}[a-zA-Z0-9]$/i;
    const { success } = z.string().regex(re).safeParse(id);
    if (!success) {
      error = true;
    }
  } catch (err) {
    error = true;
  }

  // catch-all
  return { id, error };
}
