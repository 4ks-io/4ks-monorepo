import React from 'react';
import Skeleton from 'react-loading-skeleton';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface RecipeTileSkelProps {
  id: number;
}
const RecipeTileSkel = ({ id }: RecipeTileSkelProps) => {
  return (
    <Grid xs={8}>
      <Item>
        <Skeleton count={1} />
        <Skeleton height={160} />
      </Item>
    </Grid>
  );
};

export default RecipeTileSkel;
