import React, { useEffect, useState } from 'react';
import {
  GitFork,
  Star,
  Code,
  Social,
  BrandFacebook,
  BrandMessenger,
  BrandInstagram,
  BrandHipchat,
  BrandTwitter,
  BrandGmail,
} from 'tabler-icons-react';
import {
  Avatar,
  ActionIcon,
  Header,
  Image,
  Grid,
  TextInput,
  Box,
  Badge,
  Button,
  Group,
  Divider,
  Breadcrumbs,
  Anchor,
} from '@mantine/core';

function getBreadcrumbs() {
  const items = [
    { title: 'nicChef001', href: '#' },
    { title: 'Caramel Crunch–Chocolate Cookies', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <Grid.Col span={2}>
      <Breadcrumbs>{items}</Breadcrumbs>
    </Grid.Col>
  );
}

function get4KsActions() {
  return (
    <Grid.Col span={1}>
      <Grid justify="space-between" columns={9}>
        <ActionIcon size={24}>
          <BrandFacebook size={28} />
        </ActionIcon>
        <ActionIcon size={24}>
          <BrandMessenger size={28} />
        </ActionIcon>
        <ActionIcon size={24}>
          <BrandInstagram size={28} />
        </ActionIcon>
        <ActionIcon size={24}>
          <BrandHipchat size={28} />
        </ActionIcon>
        <ActionIcon size={24}>
          <BrandTwitter size={28} />
        </ActionIcon>
        <ActionIcon size={24}>
          <BrandGmail size={28} />
        </ActionIcon>
      </Grid>
    </Grid.Col>
  );
}

function getSocialActions() {
  return (
    <Grid.Col span={1}>
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
  );
}

function getRecipeTabs() {
  return (
    <Grid justify="space-between" columns={12}>
      <Grid.Col span={1}>
        <Button variant="subtle">
          <Code size={20} />
          Recipe
        </Button>
      </Grid.Col>
      <Grid.Col span={1}>
        <Button variant="subtle">
          <Social size={20} />
          Comments<Badge>27</Badge>
        </Button>{' '}
      </Grid.Col>
      <Grid.Col span={1}>
        <Button variant="subtle">
          <GitFork size={20} />
          Forks<Badge>13</Badge>
        </Button>
      </Grid.Col>
      <Grid.Col span={1} offset={6}></Grid.Col>
    </Grid>
  );
}

interface IAppShellHaederProps {}

export function RecipeHeader(props: IAppShellHaederProps) {
  return (
    <>
      <Box p="md">
        <Grid justify="space-between" columns={9}>
          {getBreadcrumbs()}
          {getSocialActions()}
          {get4KsActions()}
        </Grid>
        {getRecipeTabs()}
      </Box>
      <Divider my="sm" />
    </>
  );
}

export default RecipeHeader;
