import * as React from 'react';
import { notFound } from 'next/navigation';
import { models_Recipe, models_User, models_RecipeMedia } from '@4ks/api-fetch';
import { RecipeContextProvider } from '@/providers/recipe-context';
import Container from '@mui/material/Container';
import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import RecipeToolbar from './recipe-toolbar';
import RecipeEditingControls from '@/components/Recipe/RecipeContent/RecipeEditingControls';
import { RecipeHeader } from '@/components/Recipe/RecipeHeader';

export const metadata: Metadata = {
  title: '4ks Recipe',
  description: '4ks Recipe',
};

type RecipeLayoutProps = {
  recipe: models_Recipe;
  user: models_User | undefined;
  media: models_RecipeMedia[];
  children: React.ReactNode;
};

export default async function RecipeLayout({
  recipe,
  user,
  media,
  children,
}: RecipeLayoutProps) {
  if (!recipe || !recipe.id) {
    return notFound();
  }

  return (
    <RecipeContextProvider
      isAuthenticated={!!user}
      recipe={recipe}
      media={media || []}
    >
      <AppHeader user={user} />
      <RecipeToolbar user={user} recipe={recipe} />
      <RecipeEditingControls user={user} recipe={recipe} create={false} />
      <Container sx={{ marginTop: 4 }}>
        <RecipeHeader user={user} recipe={recipe} />
        {children}
      </Container>
    </RecipeContextProvider>
  );
}
