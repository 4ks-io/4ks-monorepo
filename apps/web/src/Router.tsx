import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RecipeContextProvider } from './providers';
import {
  Landing,
  Login,
  Logout,
  NewUser,
  PageNotFound,
  Profile,
  Recipes,
  Recipe,
  Settings,
} from './pages';
import { RecipeViews } from './pages/Recipe/RecipeControls';
import { RecipeContentView } from './pages/Recipe/Views/RecipeContent';
import { RecipeCommentsView } from './pages/Recipe/Views/RecipeComments';
import { RecipeVersionsView } from './pages/Recipe/Views/RecipeVersions';
import { RecipeMediaView } from './pages/Recipe/Views/RecipeMedia';
import { RecipeStoryView } from './pages/Recipe/Views/RecipeStory';
import { RecipeSettingsView } from './pages/Recipe/Views/RecipeSettings';
import { RecipeForksView } from './pages/Recipe/Views/RecipeForks';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/new" element={<NewUser />} />
      <Route path="/me" element={<Settings />} />
      <Route path="/:userName" element={<Profile />} />
      <Route path="/r" element={<Recipes />} />
      <Route path="/r/0" element={<Recipe />}>
        <Route index element={<RecipeContentView create />} />
      </Route>
      <Route path="/r/:recipeId" element={<Recipe />}>
        <Route index element={<RecipeContentView />} />
        <Route path="m" element={<RecipeMediaView />} />
        <Route path="f" element={<RecipeForksView />} />
        <Route path="s" element={<RecipeSettingsView />} />
        <Route path="v" element={<RecipeVersionsView />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Router;
