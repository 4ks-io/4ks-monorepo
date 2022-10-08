import React from 'react';
import { Stack, IStackProps } from '@fluentui/react/lib/Stack';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

const RecipeLoading: React.FunctionComponent = () => {
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
      <Spinner size={SpinnerSize.large} />
    </Stack>
  );
};

export default RecipeLoading;
