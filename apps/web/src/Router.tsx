import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Recipe, Landing } from './pages';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/recipes">
          <Route path=":id" element={<Recipe />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
