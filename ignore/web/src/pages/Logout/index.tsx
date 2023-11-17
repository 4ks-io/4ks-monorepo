import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const Logout = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const p = localStorage.getItem('locationPathname') || '/';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(p);
    }
  }, [isAuthenticated]);

  return (
    <div style={{ marginTop: 120 }}>
      <CircularProgress />
    </div>
  );
};

export { Logout };
export default { Logout };
