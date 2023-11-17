import React from 'react';
import Typography from '@mui/material/Typography';

export function SectionTitle(props: { value: string }) {
  return (
    <Typography variant="h5" gutterBottom>
      {props.value}
    </Typography>
  );
}
