import {
  OpenAPI,
  // ProjectsService,
} from '@4ks/api-fetch';

export interface API {
  // subscription: typeof SubscriptionService;
}

export default function ApiServiceFactory(token: string): API {
  OpenAPI.TOKEN = token;
  OpenAPI.BASE = `/api`;

  return {
    // subscription: SubscriptionService,
  };
}
