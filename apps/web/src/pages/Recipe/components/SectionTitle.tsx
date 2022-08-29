import React from 'react';
import { Label } from '@fluentui/react/lib/Label';

export function SectionTitle(props: { value: string }) {
  return (
    <Label style={{ fontSize: '14px', fontWeight: 600 }}>{props.value}</Label>
  );
}
