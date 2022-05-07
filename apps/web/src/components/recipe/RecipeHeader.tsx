import React, { useState } from 'react';
import { GitFork, Star, Code, Social } from 'tabler-icons-react';
import {
  Avatar,
  ActionIcon,
  Header,
  Image,
  Grid,
  TextInput,
  Badge,
  Button,
  Group,
} from '@mantine/core';
import { Breadcrumbs, Anchor } from '@mantine/core';

interface IAppShellHaederProps {}

export function RecipeHeader(props: IAppShellHaederProps) {
  const highlight = {};

  const items = [
    { title: 'nicChef001', href: '#' },
    { title: 'Caramel Crunch–Chocolate Cookies', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <Header height={96} p="md" style={{ marginTop: '64px' }}>
      <Grid justify="space-between" columns={9}>
        <Grid.Col style={highlight} span={2}>
          <Breadcrumbs>{items}</Breadcrumbs>
        </Grid.Col>

        <Grid.Col style={highlight} span={1}>
          <Grid justify="space-between" columns={9}>
            <ActionIcon size={24}>
              <GitFork size={28} />
            </ActionIcon>
            <Badge>123</Badge>
            <ActionIcon size={24}>
              <Star size={28} />
            </ActionIcon>
            <Badge>5k</Badge>
          </Grid>
        </Grid.Col>
      </Grid>
      <Group position="center" mt="xl">
        <Button variant="subtle">
          <Code size={20} />
          Recipe
        </Button>
        <Button variant="subtle">
          <Social size={20} />
          Comments<Badge>27</Badge>
        </Button>
        <Button variant="subtle">
          <GitFork size={20} />
          Forks<Badge>13</Badge>
        </Button>
      </Group>
    </Header>
  );
}

export default RecipeHeader;
