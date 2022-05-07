import React, { useState } from 'react';
import logo from '../../logo.svg';
import { Settings } from 'tabler-icons-react';
import {
  Avatar,
  ActionIcon,
  Header,
  Image,
  Grid,
  TextInput,
} from '@mantine/core';

interface IAppShellHaederProps {
  toggleColorScheme: () => void;
}

export function AppNavBar(props: IAppShellHaederProps) {
  const highlight = {}; //{ backgroundColor: 'grey' };
  const [searchWidth, setSearchWidth] = useState(256);

  return (
    <Header height={64} p="md">
      <Grid justify="space-between" columns={9}>
        <Grid.Col style={highlight} span={4}>
          <Grid>
            <Grid.Col style={highlight} span={1}>
              <div style={{ width: 36 }}>
                <Image src={logo} alt="logo" />
              </div>
            </Grid.Col>
            <Grid.Col style={highlight} span={1} offset={1}>
              <TextInput
                placeholder="Search"
                radius="xl"
                style={{ width: `${searchWidth}px` }}
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
                onClick={() => props.toggleColorScheme()}
              >
                <Settings size={24} />
              </ActionIcon>
            </Grid.Col>
            <Grid.Col style={highlight} span={1}>
              <Avatar radius="xl" />
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
      {/* <Grid justify="space-between" columns={24}>
        <Grid.Col span={1}>
          <div style={{ width: 36 }}>
            <Image src={logo} alt="logo" />
          </div>
        </Grid.Col>
        <Grid.Col span={1}>
          <TextInput
            placeholder="Search"
            label="Search"
            radius="xl"
            style={{ width: '256px' }}
          />
        </Grid.Col>
        <Grid.Col span={1} offset={22} style={{ backgroundColor: 'pink' }}>
          
        </Grid.Col>
      </Grid> */}
    </Header>
  );
}

export default AppNavBar;
