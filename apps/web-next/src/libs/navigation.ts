import { getSession } from '@auth0/nextjs-auth0';
import { serverClient } from '@/trpc/serverClient';
import { models_Recipe, dtos_GetRecipeMediaResponse } from '@4ks/api-fetch';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { headers } from 'next/headers';
import path from 'path';
// import {ReadonlyHeaders } from 'next/dist/next-server/server/api-utils';

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
  pathname: string;
  title: string;
  recipeID: string;
  recipePage: number;
  recipePageName: string;
};

export function getRecipePageInfo(headersList: any): RecipePageInfo {
  const pathname = headersList.get('x-url-pathname') || '';
  const p = pathname.replace('/recipe/', '').split('/');
  // for (let i = 0; i < p.length; i++) {
  //   p[i] = decodeURIComponent(p[i]);
  //   console.log(p[i]);
  // }

  const id = p[0].split('-')[0];
  const title = p[0].replace(id, '').replace('-', '').trim();

  if (p.length == 1) {
    return {
      pathname: pathname,
      title: title,
      recipeID: id,
      recipePage: RecipeView[''],
      recipePageName: '',
    };
  }

  return {
    pathname: pathname,
    title: title,
    recipeID: id,
    recipePage: RecipeView[p[1] as keyof typeof RecipeView],
    recipePageName: p[1],
  };
}

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
