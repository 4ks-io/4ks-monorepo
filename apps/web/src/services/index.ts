import { ApiClient } from '@4ks/api-fetch';

export default function ApiServiceFactory(token: string): ApiClient {
  return new ApiClient({
    BASE: '/api',
    TOKEN: token,
  });
}
