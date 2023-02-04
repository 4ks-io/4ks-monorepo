import React from 'react';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

const Login = () => {
  return (
    <div style={{ marginTop: 120 }}>
      <Spinner size={SpinnerSize.large} />
    </div>
  );
};

export { Login };
export default { Login };
