import { ApiClient } from '@4ks/api-fetch';

export default function ApiServiceFactory(
  token: string | undefined
): ApiClient {
  if (token) {
    return new ApiClient({
      BASE: '/api',
      TOKEN: token,
    });
  }
  return new ApiClient({
    BASE: '/api',
  });
}
