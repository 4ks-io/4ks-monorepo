import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const fetchCache = 'force-no-store';

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email offline_access',
    },
  }),
});
