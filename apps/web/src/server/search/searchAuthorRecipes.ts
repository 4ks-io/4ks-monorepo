import { TypesenseSearchResult } from '@/server/search-client';

// searchRecipesResponse
export default async function SearchAuthorRecipes(client: any, query: string) {
  const searchParameters = {
    q: query,
    query_by: 'author',
    per_page: 21,
  };

  try {
    const res = (await client
      .collections('recipes')
      .documents()
      .search(searchParameters)) as TypesenseSearchResult;

    return res;
  } catch (e) {
    console.log(e);
  }
}
