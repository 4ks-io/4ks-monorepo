import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Recipe, Landing, Home } from './pages';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/recipes">
          <Route path=":id" element={<Recipe />} />
        </Route>
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
