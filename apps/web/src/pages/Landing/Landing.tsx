import React from 'react';
import {
  ActionButton,
  Stack,
  Image,
  ImageFit,
  TextField,
} from '@fluentui/react';
import { useAuth0 } from '@auth0/auth0-react';

import Logo from '../../logo.svg';

const Landing = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  function handleLoginOnClick() {
    loginWithRedirect();
  }
  function handleLogoutOnClick() {
    logout({ returnTo: window.location.origin });
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignContent: 'center',
      }}
    >
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        style={{ width: '100%', rowGap: 10 }}
      >
        <Image src={Logo} width={150} imageFit={ImageFit.contain}></Image>
        <TextField
          placeholder="Search for a recipe..."
          styles={{
            fieldGroup: {
              height: '40px',
              borderColor: 'lightgray',
            },
            field: {
              fontSize: 16,
              height: '40px',
            },
          }}
        />

        {isAuthenticated ? (
          <ActionButton onClick={handleLogoutOnClick}>Logout</ActionButton>
        ) : (
          <ActionButton onClick={handleLoginOnClick}>Login</ActionButton>
        )}
      </Stack>
    </div>
  );
};

export default Landing;
