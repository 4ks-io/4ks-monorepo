import React from 'react';
import FontSizeChanger from 'react-font-size-changer';
import { IconButton } from '@fluentui/react/lib/Button';

interface RecipeFontControlsProps {}

export function RecipeFontControls(props: RecipeFontControlsProps) {
  return (
    <FontSizeChanger
      targets={['#target .contentResizer']}
      // onChange={(element: any, newValue: any, oldValue: any) => {
      //   console.log(element, newValue, oldValue);
      // }}
      options={{
        stepSize: 2,
        range: 3,
      }}
      customButtons={{
        up: (
          <IconButton
            iconProps={{ iconName: 'ZoomIn' }}
            title="ZoomIn"
            ariaLabel="ZoomIn"
          />
        ),
        down: (
          <IconButton
            iconProps={{ iconName: 'ZoomOut' }}
            title="ZoomOut"
            ariaLabel="ZoomOut"
          />
        ),
        style: {
          color: 'white',
        },
        buttonsMargin: 2,
      }}
    />
  );
}
