'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { trpc } from '@/trpc/client';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { z } from 'zod';

export default function NewUser() {
  const { user, error, isLoading } = useUser();

  if (error) {
    return 'error';
  }

  if (isLoading || !user) {
    return (
      <>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <AccountCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            New User Registration
          </Typography>
          <Image
            alt="Avatar"
            src={`${user?.picture}`}
            width={96}
            height={96}
            priority={false}
          />
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="display-name"
                  name="displayName"
                  required
                  fullWidth
                  id="displayName"
                  label={'Display Name'}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label={'Email Address'}
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="username"
                  label={'Username'}
                  type="username"
                  id="username"
                  autoComplete="new-username"
                />
                <Typography component={'span'} variant={'body2'}>
                  <ul>
                    <li>Min length: 8 characters.</li>
                    <li>Max length: 24 characters.</li>
                    <li>
                      Characters must be either a hyphen ( - ) or alphanumeric.
                    </li>
                    <li>Cannot start or end with a hyphen.</li>
                    <li>Cannot include consecutive hyphens.</li>
                    <li>Cannot be a reserved word.</li>
                    <li>Must be globally unique.</li>
                  </ul>
                </Typography>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              type="submit"
            >
              Register
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
