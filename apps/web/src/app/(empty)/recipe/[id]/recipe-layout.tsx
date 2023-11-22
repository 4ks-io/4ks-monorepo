import * as React from 'react';
import { notFound } from 'next/navigation';
import { RecipeContextProvider } from '@/providers/recipe-context';
import Container from '@mui/material/Container';
import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import RecipeToolbar from './recipe-toolbar';
import RecipeEditingControls from '@/components/Recipe/RecipeContent/RecipeEditingControls';
import { RecipeHeader } from '@/components/Recipe/RecipeHeader';
import { RecipeMediaProps } from '@/types/recipe';

export const metadata: Metadata = {
  title: '4ks Recipe',
  description: '4ks Recipe',
};

type RecipeLayoutProps = RecipeMediaProps & {
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
