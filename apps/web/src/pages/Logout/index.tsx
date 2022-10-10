import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const p = localStorage.getItem('locationPathname') || '/';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(p, { replace: true });
    }
  }, [isAuthenticated]);

  return <Link to={p}>redir {p}</Link>;
};

export { Logout };
export default { Logout };
