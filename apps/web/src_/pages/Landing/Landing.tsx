import React from 'react';
import { Stack, Image, ImageFit, TextField } from '@fluentui/react';
import { PageLayout } from '../Layout';

import Logo from '../../logo.svg';

const Landing = () => {
  return (
    <PageLayout>
      <div
        style={{
          height: '80vh',
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
          <Image src={Logo} width={100} imageFit={ImageFit.contain}></Image>
          <TextField
            placeholder="Search . . ."
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
    </PageLayout>
  );
};

export default Landing;
