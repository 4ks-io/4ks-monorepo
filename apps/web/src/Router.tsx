import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RecipeContextProvider } from './providers/recipe-context';
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
      <Route
        path="/:userName/:recipeTitle"
        element={
          <RecipeContextProvider>
            <Recipe create={false} />
          </RecipeContextProvider>
        }
      />
      <Route
        path="/r/0"
        element={
          <RecipeContextProvider>
            <Recipe create />
          </RecipeContextProvider>
        }
      />
      <Route
        path="/r/:recipeId"
        element={
          <RecipeContextProvider>
            <Recipe create={false} />
          </RecipeContextProvider>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Router;
