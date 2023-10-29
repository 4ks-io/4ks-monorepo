import { apiURL } from '@/server/index';

export type HeadAuthenticatedUserResponse = {
  Status: number;
  Message: string;
};

// headAuthenticatedUser makes a HEAD request to the users service to check if the user is authenticated
export async function headAuthenticatedUser(accessToken: string) {
  // Create a fetch request oauth-testbject with the JWT token in the Authorization header
  // todo: load url from env var
  const request = new Request(apiURL + '/api/user/', {
    method: 'HEAD',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Perform request
  const response = await fetch(request);

  // Craft response
  const res = {
    Status: response.status,
    Message: 'Success',
  } as HeadAuthenticatedUserResponse;

  // response
  if ([200, 204].includes(response.status)) {
    return res;
  }

  res.Message = 'Error';
  return res;
}
