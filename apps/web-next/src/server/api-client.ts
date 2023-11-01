import { getAccessToken } from '@auth0/nextjs-auth0';
import { ApiClient } from '@4ks/api-fetch';

export const apiURL = `${process.env.IO_4KS_API_URL}`;

export async function getAPIClient(): Promise<ApiClient> {
  const { accessToken } = await getAccessToken();
  return new ApiClient({
    BASE: apiURL,
    TOKEN: accessToken,
  });
}
