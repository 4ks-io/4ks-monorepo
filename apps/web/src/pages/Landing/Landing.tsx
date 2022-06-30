import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ActionButton,
  Stack,
  Image,
  ImageFit,
  TextField,
} from '@fluentui/react';
import { PageLayout } from '../Layout';
import { useAuth0 } from '@auth0/auth0-react';

import Logo from '../../logo.svg';

const Landing = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  function handleLoginOnClick() {
    loginWithRedirect();
  }
  function handleLogoutOnClick() {
    logout({ returnTo: window.location.origin });
  }
  function handleMeClick() {
    navigate('/me', { replace: true });
  }
  function handleRecipesClick() {
    navigate('/recipes', { replace: true });
  }

  return (
    <PageLayout>
      <div
        style={{
          height: '80vh',
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
          <Image src={Logo} width={100} imageFit={ImageFit.contain}></Image>
          <TextField
            placeholder="Search . . ."
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
        </Stack>
      </div>
    </PageLayout>
  );
};

export default Landing;
