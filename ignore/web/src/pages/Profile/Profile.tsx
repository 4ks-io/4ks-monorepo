import { models_Recipe } from '@4ks/api-fetch';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSessionContext } from '../../providers';

const Profile = () => {
  const ctx = useSessionContext();
  let { userName } = useParams();
  const [recipes, setRecipes] = useState<models_Recipe[]>();

  async function fetchUserRecipes() {
    if (userName && ctx.api?.recipes) {
      const r = await ctx.api.recipes.getRecipesAuthor(userName);
      setRecipes(r);
    }
  }

  useEffect(() => {
    fetchUserRecipes();
  }, [ctx.api, userName]);

  return (
    <>
      <h2>@{userName}</h2>
      <h3>Recipes</h3>
      <ul>
        {recipes?.map((r) => {
          return (
            <li key={r.id}>
              <a href={`r/${r.id}`}>{r.currentRevision?.name || r.id}</a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Profile;
