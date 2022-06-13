import React from 'react';
import { Stack, Image, ImageFit, TextField } from '@fluentui/react';

import Logo from '../../logo.svg';

const Landing = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignContent: 'center',
      }}
    >
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        style={{ width: '100%', rowGap: 10 }}
      >
        <Image src={Logo} width={150} imageFit={ImageFit.contain}></Image>
        <TextField
          placeholder="Search for a recipe..."
          styles={{
            fieldGroup: {
              height: '40px',
              borderColor: 'lightgray',
            },
            field: {
              fontSize: 16,
              height: '40px',
            },
          }}
        />
      </Stack>
    </div>
  );
};

export default Landing;
