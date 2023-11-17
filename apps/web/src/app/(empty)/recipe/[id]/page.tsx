import * as React from 'react';
import { notFound } from 'next/navigation';
import { Page, PageProps } from '@/libs/navigation';
import { handleUserNavigation } from '@/libs/server/navigation';
import { getRecipeIdFromPageParams } from './navigation';
import { getRecipeData, getRecipeMedia } from './data';
import log from '@/libs/logger';
import type { Metadata } from 'next';
import RecipeLayout from './recipe-layout';
import RecipeBody from './recipe-body';

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, error } = getRecipeIdFromPageParams(params);
  if (error) {
    return notFound();
  }

  if (id === '0') {
    return {
      title: '4ks New Recipe',
      description: '4ks',
    };
  }

  // data
  const recipeData = await getRecipeData(id);
  if (!recipeData?.data) {
    return {
      title: '4ks Recipe',
      description: '4ks',
    };
  }

  // const mediaData = recipeData?.data?.root
  //   ? (await getRecipeMedia(recipeData?.data?.root)) ?? { data: [] }
  //   : { data: [] };

  // todo: add recipe as jsondl

  // const m = media?.data?.map((m) => {
  //   return m.variants?.map((v) => {
  //     return v.url;
  //   });
  // });
  // console.log(m);
  // todo: add media to metatada

  return {
    title: recipeData?.data?.currentRevision?.name,
    description: '4ks',
    // openGraph: {
    //   images: m as string[],
    // },
  };
}

export default async function RecipePage({ params, searchParams }: PageProps) {
  const { id, error } = getRecipeIdFromPageParams(params);
  if (error) {
    return notFound();
  }

  // data
  const [recipeData, userData] = await Promise.all([
    getRecipeData(id),
    handleUserNavigation(Page.ANONYMOUS),
  ]);

  if (!recipeData?.data) {
    log().Error(new Error(), [{ k: 'msg', v: 'failed to fetch recipe' }]);
    return notFound();
  }

  const mediaData = recipeData?.data?.root
    ? (await getRecipeMedia(recipeData?.data?.root)) ?? { data: [] }
    : { data: [] };

  return (
    <RecipeLayout
      recipe={recipeData.data}
      user={userData.user}
      media={mediaData.data || []}
    >
      <RecipeBody
        user={userData.user}
        recipe={recipeData.data}
        media={mediaData.data || []}
      />
    </RecipeLayout>
  );
}
