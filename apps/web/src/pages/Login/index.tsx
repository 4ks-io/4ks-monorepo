import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../../providers';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

const Login = () => {
  const { isAuthenticated, user } = useAuth0();
  const ctx = useSessionContext();
  const navigate = useNavigate();

  const p = localStorage.getItem('locationPathname') || '/';

  useEffect(() => {
    if (isAuthenticated && user && typeof ctx?.api != undefined) {
      ctx?.api?.users
        .getUsersProfile()
        .then((u) => {
          navigate(p);
        })
        .catch(() => {
          navigate('/new', { replace: true });
        });
    }
  }, [isAuthenticated, user, ctx?.api]);

  return <Spinner size={SpinnerSize.large} />;
};

export { Login };
export default { Login };
