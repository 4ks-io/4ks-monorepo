import { TypesenseSearchResult } from '@/server/search-client';

// searchRecipesResponse
export default async function SearchRecipes(client: any, query: string) {
  const searchParameters = {
    q: query,
    // query_by: 'company_name',
    // filter_by: 'num_employees:>100',
    // sort_by: 'num_employees:desc',
    query_by: 'name,author,ingredients',
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
