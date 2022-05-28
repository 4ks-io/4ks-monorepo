import React, { useState } from 'react';
import logo from '../../logo.svg';
import { Settings, Login, Logout } from 'tabler-icons-react';
import {
  Avatar,
  ActionIcon,
  Header,
  Image,
  Grid,
  TextInput,
  useMantineTheme,
  Tooltip,
} from '@mantine/core';
import { useAuth0 } from '@auth0/auth0-react';

import { themeHotKey } from '../../App';

interface IAppShellHaederProps {
  toggleColorScheme: () => void;
}

export function AppNavBar(props: IAppShellHaederProps) {
  const theme = useMantineTheme();
  const { loginWithRedirect, logout } = useAuth0();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const highlight = {}; //{ backgroundColor: 'grey' };
  const [searchWidth, setSearchWidth] = useState(256);

  function handleAvatarOnClick() {
    fetch('https://local.4ks.io/api/version')
      .then((response) => response.json())
      .then((data) => console.log(data));

    // if (isLoading) {
    //   return <div>Loading ...</div>;
    // }

    isAuthenticated && user && !isLoading && console.log(user);
  }
  function handleLoginOnClick() {
    loginWithRedirect();
  }
  function handleLogoutOnClick() {
    logout({ returnTo: window.location.origin });
  }

  return (
    <Header
      height={64}
      p="md"
      style={{ backgroundColor: theme.colors.dark[9] }}
    >
      <Grid justify="space-between" columns={9}>
        <Grid.Col style={highlight} span={4}>
          <Grid>
            <Grid.Col style={highlight} span={1}>
              <div style={{ width: 28 }}>
                <Image src={logo} alt="logo" />
              </div>
            </Grid.Col>
            <Grid.Col style={highlight} span={1} offset={1}>
              <TextInput
                placeholder="Search"
                radius="xl"
                style={{ height: '24px', width: `${searchWidth}px` }}
                onFocus={() => setSearchWidth(512)}
                onBlur={() => setSearchWidth(256)}
              />
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col style={highlight} span={1}>
          <Grid columns={2}>
            <Grid.Col style={highlight} span={1}>
              <ActionIcon
                variant="light"
                size={24}
                onClick={() => props.toggleColorScheme()}
              >
                <Tooltip
                  label={themeHotKey}
                  position="bottom"
                  placement="center"
                  gutter={10}
                >
                  <Settings size={28} />
                </Tooltip>
              </ActionIcon>
            </Grid.Col>
            <Grid.Col style={highlight} span={1}>
              <Avatar radius="xl" size={28} onClick={handleAvatarOnClick} />
            </Grid.Col>
            <Grid.Col style={highlight} span={1}>
              <Login radius="xl" size={28} onClick={handleLoginOnClick} />
            </Grid.Col>
            <Grid.Col style={highlight} span={1}>
              <Logout radius="xl" size={28} onClick={handleLogoutOnClick} />
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </Header>
  );
}

export default AppNavBar;
