export const authLoginPath = '/app/auth/login';
export const authLogoutPath = '/app/auth/logout';

// todo: deprecated
// https://stackoverflow.com/questions/10527983/best-way-to-detect-mac-os-x-or-windows-computers-with-javascript-or-jquery
export const isMac = () => {
  if (navigator) {
    // console.log('navigator.platform', navigator.platform);
    return navigator.platform.indexOf('Mac') > -1;
  }
  return false;
};

export enum Page {
  LANDING,
  REGISTER,
  // any page requiring authentication and authorization
  AUTHENTICATED,
  // any page available to anonymous users
  ANONYMOUS,
}

export type PageProps = {
  params: PagePropsParams;
  searchParams: PagePropsSearchParams;
};

export type RecipePropsParams = { id: string };

export type PagePropsParams = { slug: string };
export type PagePropsSearchParams = {
  [key: string]: string | string[] | undefined;
};

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

export type RecipePageInfo = {
  segment: string;
  title: string;
  recipeID: string;
  recipePage: number;
  recipePageName: string;
};

export function normalizeForURL(s: string | undefined) {
  if (!s) {
    // todo: i18n
    return 'recipe-title';
  }
  // Convert i18n characters like é, ü, etc. to their base
  const normalizedStr = s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Replace spaces with hyphens, remove special characters, and convert to lowercase
  return normalizedStr.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');
}
