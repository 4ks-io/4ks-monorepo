import * as React from 'react';
import { RecipeProps } from '@/types/recipe';
import RecipeSettings from '@/components/Recipe/RecipeSettings';
import { notFound } from 'next/navigation';

export default function RecipeSettingsPage({ user, recipe }: RecipeProps) {
  const isAuthor = !user || recipe.author?.id !== user.id;
  if (isAuthor) {
    return notFound();
  }

  return <RecipeSettings recipe={recipe} />;
}
