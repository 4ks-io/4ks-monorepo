import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing, Recipes, Recipe, Login, Logout, PageNotFound } from './pages';
import { RecipeContextProvider } from './providers/recipe-context';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route
          path="/recipes/0"
          element={
            <RecipeContextProvider>
              <Recipe create />
            </RecipeContextProvider>
          }
        />
        <Route
          path="/recipes/:id"
          element={
            <RecipeContextProvider>
              <Recipe />
            </RecipeContextProvider>
          }
        />
        <Route path="/me" element={<Recipes />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
