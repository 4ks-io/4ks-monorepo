import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Landing,
  Login,
  Logout,
  PageNotFound,
  Profile,
  Recipes,
  Recipe,
  Settings,
} from './pages';
import { RecipeContextProvider } from './providers/recipe-context';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/r" element={<Recipes />} />
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
              <Recipe />
            </RecipeContextProvider>
          }
        />
        <Route path="/me" element={<Settings />} />
        <Route path="/:uid" element={<Profile />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
