import React from 'react';
import { Stack, IStackProps } from '@fluentui/react/lib/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const RecipeLoading = () => {
  const rowProps: IStackProps = { horizontal: true, verticalAlign: 'center' };
  const tokens = {
    sectionStack: {
      childrenGap: 10,
    },
    spinnerStack: {
      childrenGap: 20,
    },
  };

  return (
    <Stack {...rowProps} tokens={tokens.spinnerStack}>
      <CircularProgress />
    </Stack>
  );
};

export default RecipeLoading;
