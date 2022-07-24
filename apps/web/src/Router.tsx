import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing, Recipes, Recipe } from './pages';
import { RecipeContextProvider } from './providers/recipe-context';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes">
          <Route
            path=":id"
            element={
              <RecipeContextProvider>
                <Recipe />
              </RecipeContextProvider>
            }
          />
        </Route>
        <Route path="/me" element={<Recipes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
